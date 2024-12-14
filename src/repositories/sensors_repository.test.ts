import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { database } from "../database";
import { SensorsRepository } from "./sensors_repository";

describe("SensorsRepository", () => {
  beforeEach(() => {
    database.clear();
  });

  it("should create", async () => {
    const sensor = {
      name: "Sensor",
    };

    const result = await SensorsRepository.create(sensor);

    assert.deepEqual(result, { id: 1, ...sensor });
  });

  it("should list all created sensors", async () => {
    await SensorsRepository.create({ name: "BedSense A" });
    await SensorsRepository.create({ name: "BedSense B" });

    const results = await SensorsRepository.list();

    assert.deepEqual(results, [
      { id: 1, name: "BedSense A" },
      { id: 2, name: "BedSense B" },
    ]);
  });

  it("should update a record correctly", async () => {
    const sensor = await SensorsRepository.create({ name: "BedSense X" });

    const updatedSensor = await SensorsRepository.update(sensor.id, {
      name: "BedSense Y",
    });

    const expected = { id: 1, name: "BedSense Y" };
    assert.deepEqual(updatedSensor, expected);
    assert.deepEqual(await SensorsRepository.list(), [expected]);
  });
});
