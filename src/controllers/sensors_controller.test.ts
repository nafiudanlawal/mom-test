import Koa from "koa";
import assert from "node:assert";
import { before, after, beforeEach, describe, it } from "node:test";
import { database } from "../database";
import { SensorsController } from "./sensors_controller";
import { SensorsRepository } from "../repositories/sensors_repository";
import { SensorValue, SensorValuesRepository } from "../repositories/sensor_values_repository";
import { mean } from "../utils/mean";
import Sinon from "sinon";

describe("SensorsController", () => {
  let clock: Sinon.SinonFakeTimers;
  const timestamp = 1734215257638;

  before(() => {
    // Stop the clock
    clock = Sinon.useFakeTimers({ now: timestamp });
  });
  after(() => {
    clock.restore();
  });

  beforeEach(() => {
    database.clear();
  });

  it("should read sensors including sensor values", async () => {
    if (!SensorsController.read) {
      assert.fail("SensorsController.read not implemented");
    }
    SensorsRepository.create({ name: "Sensor Name" });
    const sensorValue1 = {
      timestamp,
      sensor_id: 1,
      values: [1, 2, 3],
    }
    const sensorValue2 = {
      timestamp: timestamp + 100, // add 100 seconds difference
      sensor_id: 1,
      values: [5, 4, 3],
    }
    SensorValuesRepository.create(sensorValue1);
    //add 100 seconds
    clock.tick(100);
    SensorValuesRepository.create(sensorValue2);

    const ctx = { params: { id: 1 }, body: {} } as unknown as Koa.Context;
    await SensorsController.read(ctx);

    assert.deepEqual(ctx.body, {
      id: 1,
      name: "Sensor Name",
      values: [
        [sensorValue1.timestamp, mean(sensorValue1.values)],
        [sensorValue2.timestamp, mean(sensorValue2.values)]
      ],
    });
  });

  it("should return error message when sensor not found", async () => {
    if (!SensorsController.read) {
      assert.fail("SensorsController.read not implemented");
    }
    SensorsRepository.create({ name: "Sensor Name" });
    const sensorValue1 = {
      sensor_id: 1,
      values: [1, 2, 3],
    }
    const sensorValue2 = {
      sensor_id: 1,
      values: [5, 4, 3],
    }
    SensorValuesRepository.create(sensorValue1);
    SensorValuesRepository.create(sensorValue2);

    const ctx = { params: { id: 15 }, body: {} } as unknown as Koa.Context;
    await SensorsController.read(ctx);

    assert.deepEqual(ctx.body, {
      message: "Failed to find Sensor with id '15'"
    });
  });

  it("should update sensors correctly", async () => {
    if (!SensorsController.update) {
      assert.fail("SensorsController.update not implemented");
    }
    SensorsRepository.create({ name: "Initial Name" });

    const ctx = {
      params: { id: 1 },
      request: { body: { name: "Updated Name" } },
      body: {},
    } as unknown as Koa.Context;
    await SensorsController.update(ctx);

    assert.deepEqual(ctx.body, { id: 1, name: "Updated Name" });
  });

  it("should update sensors with only expected data correctly", async () => {
    if (!SensorsController.update) {
      assert.fail("SensorsController.update not implemented");
    }
    SensorsRepository.create({ name: "Initial Name" });

    const ctx = {
      params: { id: 1 },
      request: { body: { name: "Updated Name", test: "Test data" } },
      body: {},
    } as unknown as Koa.Context;
    await SensorsController.update(ctx);

    assert.deepEqual(ctx.body, { id: 1, name: "Updated Name" });
  });

  it("should delete sensors correctly", async () => {
    if (!SensorsController.delete) {
      assert.fail("SensorsController.delete not implemented");
    }
    SensorsRepository.create({ name: "Initial Name" });

    const ctx = {
      params: { id: 1 },
      body: {},
    } as unknown as Koa.Context;
    await SensorsController.delete(ctx);

    assert.equal(ctx.status, 204);
  });
});
