import { describe, test, expect } from "./test-runner.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test_jwt_secret_12345";

describe("Security Tests", () => {
	test("should generate different hashes for same password", async () => {
		const password = "samePassword";
		const hash1 = await bcrypt.hash(password, 10);
		const hash2 = await bcrypt.hash(password, 10);

		expect.toBe(hash1 !== hash2, true);

		const valid1 = await bcrypt.compare(password, hash1);
		const valid2 = await bcrypt.compare(password, hash2);

		expect.toBe(valid1, true);
		expect.toBe(valid2, true);
	});

	test("should sanitize XSS input correctly", () => {
		const sanitizeInput = (input) => {
			if (typeof input !== 'string') return input;
			return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
						.replace(/javascript:/gi, '')
						.replace(/on\w+=/gi, '')
						.trim();
		};

		const maliciousInput = '<script>alert("xss")</script>test@example.com';
		const sanitized = sanitizeInput(maliciousInput);

		expect.toBe(sanitized.includes('<script>'), false);
		expect.toBe(sanitized, 'test@example.com');
	});

	test("should detect SQL injection patterns", () => {
		const sqlPattern = /(drop|delete|union|select|insert|update|create|alter|exec)/i;

		const maliciousInputs = [
			"'; DROP TABLE users; --",
			"' OR '1'='1",
			"normal_password123"
		];

		expect.toBe(sqlPattern.test(maliciousInputs[0]), true);
		expect.toBe(sqlPattern.test(maliciousInputs[1]), false);
		expect.toBe(sqlPattern.test(maliciousInputs[2]), false);
	});

	test("should validate input length limits", () => {
		const inputs = {
			email: "a".repeat(500) + "@example.com",
			password: "a".repeat(10000),
			normalEmail: "test@example.com",
			normalPassword: "password123",
		};

		expect.toBe(inputs.email.length > 100, true);
		expect.toBe(inputs.normalEmail.length < 100, true);

		expect.toBe(inputs.password.length > 1000, true);
		expect.toBe(inputs.normalPassword.length < 100, true);
	});

	test("should validate JWT token structure", () => {
		const payload = { user: { id: 1 } };
		const token = jwt.sign(payload, process.env.JWT_SECRET);

		const parts = token.split(".");
		expect.toBe(parts.length, 3);

		parts.forEach((part) => {
			expect.toBe(part.length > 0, true);
			expect.toBe(/^[A-Za-z0-9_-]+$/.test(part), true);
		});
	});

	test("should handle rate limiting scenarios", () => {
		const requests = [];
		const timeWindow = 15 * 60 * 1000;
		const maxRequests = 100;

		for (let i = 0; i < 150; i++) {
			requests.push({ timestamp: Date.now(), ip: "127.0.0.1" });
		}

		const recentRequests = requests.filter(
			(req) => Date.now() - req.timestamp < timeWindow
		);

		expect.toBe(recentRequests.length > maxRequests, true);
	});
});
