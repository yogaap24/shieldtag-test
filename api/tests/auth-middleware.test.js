import { describe, test, expect } from "./test-runner.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

process.env.JWT_SECRET = "test_jwt_secret_12345";

describe("Auth Middleware Tests", () => {
	test("should authenticate valid token", () => {
		const payload = { user: { id: 1 } };
		const token = jwt.sign(payload, process.env.JWT_SECRET);

		const req = {
			header: (name) => (name === "x-auth-token" ? token : null),
		};
		const res = {
			status: () => res,
			json: () => res,
		};
		let nextCalled = false;
		const next = () => {
			nextCalled = true;
		};

		authMiddleware(req, res, next);

		expect.toBeDefined(req.user);
		expect.toBe(req.user.id, 1);
		expect.toBe(nextCalled, true);
	});

	test("should reject request without token", () => {
		const req = {
			header: () => null,
		};
		let statusCode = null;
		let responseData = null;
		const res = {
			status: (code) => {
				statusCode = code;
				return res;
			},
			json: (data) => {
				responseData = data;
				return res;
			},
		};
		let nextCalled = false;
		const next = () => {
			nextCalled = true;
		};

		authMiddleware(req, res, next);

		expect.toBe(statusCode, 401);
		expect.toContain(responseData.msg, "Tidak ada token");
		expect.toBe(nextCalled, false);
	});

	test("should reject invalid token", () => {
		const req = {
			header: (name) => (name === "x-auth-token" ? "invalid-token" : null),
		};
		let statusCode = null;
		let responseData = null;
		const res = {
			status: (code) => {
				statusCode = code;
				return res;
			},
			json: (data) => {
				responseData = data;
				return res;
			},
		};
		let nextCalled = false;
		const next = () => {
			nextCalled = true;
		};

		authMiddleware(req, res, next);

		expect.toBe(statusCode, 401);
		expect.toContain(responseData.msg, "Token tidak valid");
		expect.toBe(nextCalled, false);
	});
});
