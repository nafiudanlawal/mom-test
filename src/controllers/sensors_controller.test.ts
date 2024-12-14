import Koa from "koa";
import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { database } from "../database";
import { SensorsController } from "./sensors_controller";
import { SensorsRepository } from "../repositories/sensors_repository";
import { SensorValuesRepository } from "../repositories/sensor_values_repository";

describe("SensorsController", () => {
  beforeEach(() => {
    database.clear();
  });

  it("should read sensors including sensor values", async () => {
    if (!SensorsController.read) {
      assert.fail("SensorsController.read not implemented");
    }
    SensorsRepository.create({ name: "Sensor Name" });
    SensorValuesRepository.create({
      timestamp: 123456789,
      sensor_id: 1,
      values: [1, 2, 3],
    });
    SensorValuesRepository.create({
      timestamp: 123456790,
      sensor_id: 1,
      values: [5, 4, 3],
    });

    const ctx = { params: { id: 1 }, body: {} } as unknown as Koa.Context;
    await SensorsController.read(ctx);

    assert.deepEqual(ctx.body, {
      id: 1,
      name: "Sensor Name",
      values: [
        {
          id: 1,
          sensor_id: 1,
          timestamp: 123456789,
          values: [1, 2, 3],
        },
        {
          id: 2,
          timestamp: 123456790,
          sensor_id: 1,
          values: [5, 4, 3],
        },
      ],
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
