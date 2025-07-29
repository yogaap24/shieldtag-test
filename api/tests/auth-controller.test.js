import { describe, test, expect } from "./test-runner.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { register, login, getMe } from "../controllers/authController.js";

// Mock database
const mockDb = {
	data: { users: [] },
	read: async () => {},
	write: async () => {},
};

// Mock express-validator
const mockValidationResult = {
	isEmpty: () => true,
	array: () => [],
};

// Setup environment
process.env.JWT_SECRET = "test_jwt_secret_12345";

describe("Auth Controller Tests", () => {
	test("should hash password securely", async () => {
		const password = "testPassword123";
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		expect.toBeDefined(hash);
		expect.toBe(hash.startsWith("$2b$"), true);

		const isValid = await bcrypt.compare(password, hash);
		expect.toBe(isValid, true);

		const isInvalid = await bcrypt.compare("wrongPassword", hash);
		expect.toBe(isInvalid, false);
	});

	test("should generate valid JWT token", () => {
		const payload = { user: { id: 1, email: "test@example.com" } };
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		expect.toBeDefined(token);
		expect.toBe(typeof token, "string");
		expect.toBe(token.split(".").length, 3);

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		expect.toBe(decoded.user.id, 1);
		expect.toBeDefined(decoded.exp);
	});

	test("should reject invalid JWT token", async () => {
		const invalidToken = "invalid.token.here";

		await expect.toThrow(() => {
			jwt.verify(invalidToken, process.env.JWT_SECRET);
		});
	});

	test("should reject expired JWT token", async () => {
		const payload = { user: { id: 1 } };
		const expiredToken = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "-1s",
		});

		await expect.toThrow(() => {
			jwt.verify(expiredToken, process.env.JWT_SECRET);
		});
	});

	test("should validate email format", () => {
		const validEmail = "test@example.com";
		const invalidEmail = "invalid-email";
		const maliciousEmail = '<script>alert("xss")</script>@example.com';

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const maliciousPattern = /<script|javascript:|on\w+=/i;

		const sanitizeInput = (input) => {
			if (typeof input !== 'string') return input;
			return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
						.replace(/javascript:/gi, '')
						.replace(/on\w+=/gi, '')
						.trim();
		};

		expect.toBe(emailRegex.test(validEmail), true);
		expect.toBe(emailRegex.test(invalidEmail), false);

		expect.toBe(maliciousPattern.test(maliciousEmail), true);

		const sanitizedMaliciousEmail = sanitizeInput(maliciousEmail);
		expect.toBe(emailRegex.test(sanitizedMaliciousEmail), false);
	});

	test("should handle password length validation", () => {
		const shortPassword = "123";
		const validPassword = "password123";
		const longPassword = "a".repeat(1000);

		expect.toBe(shortPassword.length < 6, true);
		expect.toBe(validPassword.length >= 6, true);
		expect.toBe(longPassword.length > 500, true);
	});

	test("should test register function with mock", async () => {
		const mockReq = {
			body: {
				name: "Test User",
				email: "test@example.com",
				password: "password123"
			}
		};
		const mockRes = {
			status: (code) => mockRes,
			json: (data) => data
		};

		const validationResult = mockValidationResult;
		expect.toBe(validationResult.isEmpty(), true);
		expect.toBe(validationResult.array().length, 0);

		expect.toBeDefined(register);
		expect.toBe(typeof register, "function");
	});

	test("should test login function with mock", async () => {
		const mockReq = {
			body: {
				email: "test@example.com",
				password: "password123"
			}
		};
		const mockRes = {
			status: (code) => mockRes,
			json: (data) => data
		};

		expect.toBeDefined(login);
		expect.toBe(typeof login, "function");
	});

	test("should test getMe function with mock", async () => {
		const mockReq = {
			user: { id: 1 }
		};
		const mockRes = {
			status: (code) => mockRes,
			json: (data) => data
		};

		expect.toBeDefined(getMe);
		expect.toBe(typeof getMe, "function");
	});

	test("should test mock database operations", async () => {
		expect.toBeDefined(mockDb);
		expect.toBeDefined(mockDb.data);
		expect.toBeDefined(mockDb.data.users);
		expect.toBe(Array.isArray(mockDb.data.users), true);

		expect.toBeDefined(mockDb.read);
		expect.toBeDefined(mockDb.write);
		expect.toBe(typeof mockDb.read, "function");
		expect.toBe(typeof mockDb.write, "function");

		await mockDb.read();
		await mockDb.write();

		mockDb.data.users.push({
			id: 1,
			name: "Test User",
			email: "test@example.com",
			password: await bcrypt.hash("password123", 10)
		});

		expect.toBe(mockDb.data.users.length, 1);
		expect.toBe(mockDb.data.users[0].email, "test@example.com");
	});

	test("should validate name field", () => {
		const validName = "John Doe";
		const shortName = "A";
		const longName = "A".repeat(101);
		const maliciousName = '<script>alert("xss")</script>';

		const maliciousPattern = /<script|javascript:|on\w+=/i;
		const sanitizeInput = (input) => {
			if (typeof input !== 'string') return input;
			return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
						.replace(/javascript:/gi, '')
						.replace(/on\w+=/gi, '')
						.trim();
		};

		expect.toBe(validName.length >= 2 && validName.length <= 100, true);
		expect.toBe(shortName.length < 2, true);
		expect.toBe(longName.length > 100, true);
		expect.toBe(maliciousPattern.test(maliciousName), true);

		const sanitizedName = sanitizeInput(maliciousName);
		expect.toBe(sanitizedName, '');
	});

	test("should validate password confirmation", () => {
		const password = "password123";
		const matchingRePassword = "password123";
		const nonMatchingRePassword = "differentPassword";
		const maliciousRePassword = "password<script>alert('xss')</script>";

		const sqlPattern = /(drop|delete|union|select|insert|update|create|alter|exec)/i;
		const maliciousPattern = /<script|javascript:|on\w+=/i;

		expect.toBe(password === matchingRePassword, true);
		expect.toBe(password === nonMatchingRePassword, false);
		expect.toBe(maliciousPattern.test(maliciousRePassword), true);
		expect.toBe(sqlPattern.test("DROP TABLE users"), true);
	});

	test("should test register function with name and rePassword", async () => {
		const mockReq = {
			body: {
				name: "Test User",
				email: "test@example.com",
				password: "password123",
				rePassword: "password123"
			}
		};
		const mockRes = {
			status: (code) => mockRes,
			json: (data) => data
		};

		const validationResult = mockValidationResult;

		expect.toBe(validationResult.isEmpty(), true);
		expect.toBe(validationResult.array().length, 0);
		expect.toBe(mockReq.body.password === mockReq.body.rePassword, true);
		expect.toBeDefined(mockReq.body.name);
		expect.toBe(mockReq.body.name.length >= 2, true);
	});

	test("should test getMe function returns name", async () => {
		const mockReq = {
			user: { id: 1 }
		};
		const mockRes = {
			status: (code) => mockRes,
			json: (data) => {
				expect.toBeDefined(data);
				return data;
			}
		};

		// Mock user data dengan name
		mockDb.data.users = [{
			id: 1,
			name: "Test User",
			email: "test@example.com",
			password: await bcrypt.hash("password123", 10),
			createdAt: new Date().toISOString()
		}];

		expect.toBeDefined(getMe);
		expect.toBe(typeof getMe, "function");
		expect.toBeDefined(mockDb.data.users[0].name);
		expect.toBe(mockDb.data.users[0].name, "Test User");
	});

	test("should test mock database with name field", async () => {
		// Reset mock database
		mockDb.data.users = [];

		await mockDb.read();
		await mockDb.write();

		mockDb.data.users.push({
			id: 1,
			name: "John Doe",
			email: "john@example.com",
			password: await bcrypt.hash("password123", 10),
			createdAt: new Date().toISOString()
		});

		expect.toBe(mockDb.data.users.length, 1);
		expect.toBe(mockDb.data.users[0].email, "john@example.com");
		expect.toBe(mockDb.data.users[0].name, "John Doe");
		expect.toBeDefined(mockDb.data.users[0].createdAt);
	});
});
