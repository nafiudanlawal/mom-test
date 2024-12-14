import assert from "node:assert";
import { SensorValueSchema, SensorSchema } from "./sensor_schemas";
import { describe, it } from "node:test";

describe("SensorValueSchema", () => {
	it("should validate correct SensorValue data", () => {
		const validData = {
			timestamp: 1699900000000,
			sensor_id: 1,
			values: [23.4, 22.8, 24.1],
		};

		assert.doesNotThrow(() => SensorValueSchema.parse(validData));
	});

	it("should throw an error if a required field is missing", () => {
		const invalidData = {
			sensor_id: 1,
			values: [23.4, 22.8, 24.1],
		};

		assert.throws(() => SensorValueSchema.parse(invalidData), /Required/);
	});

	it("should throw an error if `values` is not an array of numbers", () => {
		const invalidData = {
			timestamp: 1699900000000,
			sensor_id: 1,
			values: "not-an-array",
		};

		assert.throws(() => SensorValueSchema.parse(invalidData), /Expected array, received string/);
	});
});

describe("SensorSchema", () => {
	it("should validate correct Sensor data with optional `values`", () => {
		const validData = {
			name: "Temperature Sensor",
		};

		assert.doesNotThrow(() => SensorSchema.parse(validData));
	});

	it("should validate correct Sensor data with `values` array", () => {
		const validData = {
			name: "Temperature Sensor",
			values: [
				{
					timestamp: 1699900000000,
					sensor_id: 1,
					values: [23.4, 22.8, 24.1],
				},
			],
		};

		assert.doesNotThrow(() => SensorSchema.parse(validData));
	});

	it("should throw an error if `name` is missing", () => {
		const invalidData = {
			values: [
				{
					timestamp: 1699900000000,
					sensor_id: 1,
					values: [23.4, 22.8, 24.1],
				},
			],
		};

		assert.throws(() => SensorSchema.parse(invalidData), /Required/);
	});

	it("should throw an error if `values` contains invalid SensorValue data", () => {
		const invalidData = {
			name: "Temperature Sensor",
			values: [
				{
					timestamp: 1699900000000,
					values: [23.4, 22.8, 24.1], // Missing sensor_id
				},
			],
		};

		assert.throws(() => SensorSchema.parse(invalidData), /Required/);
	});
});
