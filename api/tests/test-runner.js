import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readdir } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));

class TestRunner {
	constructor() {
		this.passed = 0;
		this.failed = 0;
		this.tests = [];
	}

	describe(name, fn) {
		console.log(`\n ${name}`);
		fn();
	}

	test(name, fn) {
		this.tests.push({ name, fn });
	}

	async run() {
		console.log("Menjalankan tests...\n");

		for (const { name, fn } of this.tests) {
			try {
				await fn();
				console.log(`${name}`);
				this.passed++;
			} catch (error) {
				console.log(`${name}`);
				console.log(`   Error: ${error.message}`);
				this.failed++;
			}
		}

		console.log(`\n Hasil Test:`);
		console.log(`Passed: ${this.passed}`);
		console.log(`Failed: ${this.failed}`);
		console.log(`Total: ${this.passed + this.failed}`);

		if (this.failed > 0) {
			process.exit(1);
		}
	}
}

const runner = new TestRunner();

export const describe = (name, fn) => runner.describe(name, fn);
export const test = (name, fn) => runner.test(name, fn);
export const expect = {
	toBe: (actual, expected) => {
		if (actual !== expected) {
			throw new Error(`Expected ${expected}, but got ${actual}`);
		}
	},
	toEqual: (actual, expected) => {
		if (JSON.stringify(actual) !== JSON.stringify(expected)) {
			throw new Error(
				`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(
					actual
				)}`
			);
		}
	},
	toBeDefined: (actual) => {
		if (actual === undefined) {
			throw new Error("Expected value to be defined");
		}
	},
	toBeNull: (actual) => {
		if (actual !== null) {
			throw new Error(`Expected null, but got ${actual}`);
		}
	},
	toContain: (actual, expected) => {
		if (!actual.includes(expected)) {
			throw new Error(`Expected \"${actual}\" to contain \"${expected}\"`);
		}
	},
	toThrow: async (fn) => {
		try {
			await fn();
			throw new Error("Expected function to throw an error");
		} catch (error) {
			// Expected behavior
		}
	},
};

if (import.meta.url === `file://${process.argv[1]}`) {
	(async () => {
		try {
			const testFiles = await readdir(__dirname);
			const testModules = testFiles.filter((file) => file.endsWith(".test.js"));

			for (const testFile of testModules) {
				await import(join(__dirname, testFile));
			}

			await runner.run();
		} catch (error) {
			console.error("Error running tests:", error);
			process.exit(1);
		}
	})();
}
