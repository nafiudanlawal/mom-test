import assert from "node:assert";
import { after, before, beforeEach, describe, it } from "node:test";
import { SensorValuesRepository } from "./sensor_values_repository";
import { database } from "../database";
import Sinon from "sinon";

describe("SensorValuesRepository", () => {
  let clock: Sinon.SinonFakeTimers;
  const timestamp = 1734215257638;

  before(() => {
    // Stop the clock
    clock = Sinon.useFakeTimers({ now: timestamp });
  });

  beforeEach(() => {
    database.clear();
  });

  after(() => {
    clock.restore();
  });

  it("should create", async () => {
    const entry = {
      sensor_id: 1,
      timestamp,
      values: [1, 2, 3],
    };

    const result = await SensorValuesRepository.create(entry);
    assert.deepEqual(result, { ...entry, timestamp });
  });

  it("should be able to list with a filter", async () => {
    const entries = [
      {
        sensor_id: 1,
        timestamp: timestamp,
        values: [1, 2, 3],
      },
      {
        sensor_id: 2,
        timestamp: timestamp + 100,
        values: [3, 2, 1],
      },
    ];
    
    Promise.all(entries.map((entry, index) => {
      clock.tick(index * 100);
      return SensorValuesRepository.create(entry)
    }));

    const list = await SensorValuesRepository.list(
      (value) => value.sensor_id === 2
    );

    assert.deepEqual(list, [{ ...entries[1] }]);
  });
});
