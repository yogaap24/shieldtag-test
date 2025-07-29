import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import db from '../db.js'

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+=/gi, '')
                .trim();
};

export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    email = sanitizeInput(email);
    password = sanitizeInput(password);

    try {
        await db.read();
        const userExists = db.data.users.find(u => u.email === email);
        if (userExists) {
            return res.status(400).json({ msg: 'Pengguna dengan email ini sudah terdaftar.' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: db.data.users.length + 1,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        db.data.users.push(newUser);
        await db.write();

        const payload = { user: { id: newUser.id, email: newUser.email } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    email = sanitizeInput(email);
    password = sanitizeInput(password);

    try {
        await db.read();
        const user = db.data.users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ msg: 'Email atau password salah.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Email atau password salah.' });
        }

        const payload = { user: { id: user.id, email: user.email } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email
                }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

export const getMe = async (req, res) => {
    try {
        await db.read();
        const user = db.data.users.find(u => u.id === req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }

        res.json({
            id: user.id,
            email: user.email,
            createdAt: user.createdAt
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};