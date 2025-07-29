import express from 'express'
import { check } from 'express-validator'
import { register, login, getMe } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

router.post(
    '/register',
    [
        check('email', 'Harap sertakan email yang valid')
            .isEmail()
            .normalizeEmail()
            .custom((value) => {
                const maliciousPattern = /<script|javascript:|on\w+=/i;
                if (maliciousPattern.test(value)) {
                    throw new Error('Email mengandung karakter berbahaya');
                }
                if (value.length > 100) {
                    throw new Error('Email terlalu panjang');
                }
                return true;
            }),
        check('name', 'Nama harus diisi dan minimal 2 karakter')
            .isLength({ min: 2, max: 100 })
            .custom((value) => {
                const maliciousPattern = /<script|javascript:|on\w+=/i;
                if (maliciousPattern.test(value)) {
                    throw new Error('Nama mengandung karakter berbahaya');
                }
                return true;
            }),
        check('password', 'Password harus terdiri dari 6 karakter atau lebih')
            .isLength({ min: 6, max: 500 })
            .custom((value) => {
                const sqlPattern = /(drop|delete|union|select|insert|update|create|alter|exec)/i;
                if (sqlPattern.test(value)) {
                    throw new Error('Password mengandung karakter berbahaya');
                }
                return true;
            }),
        check('rePassword', 'Konfirmasi password harus diisi')
            .notEmpty()
            .custom((value) => {
                const sqlPattern = /(drop|delete|union|select|insert|update|create|alter|exec)/i;
                if (sqlPattern.test(value)) {
                    throw new Error('Konfirmasi password mengandung karakter berbahaya');
                }
                return true;
            }),
    ],
    register
);

router.post(
    '/login',
    [
        check('email', 'Harap sertakan email yang valid')
            .isEmail()
            .normalizeEmail()
            .custom((value) => {
                const maliciousPattern = /<script|javascript:|on\w+=/i;
                if (maliciousPattern.test(value)) {
                    throw new Error('Email mengandung karakter berbahaya');
                }
                return true;
            }),
        check('password', 'Password diperlukan')
            .exists()
            .custom((value) => {
                const sqlPattern = /(drop|delete|union|select|insert|update|create|alter|exec)/i;
                if (sqlPattern.test(value)) {
                    throw new Error('Password mengandung karakter berbahaya');
                }
                return true;
            }),
    ],
    login
);

router.get('/me', authMiddleware, getMe);

export default router;