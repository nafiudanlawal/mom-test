import { database } from "../database";
import { Repository } from "./_repository";

export type SensorValue = {
  timestamp: number;
  sensor_id: number;
  values: number[];
};

export const SensorValuesRepository: Repository<SensorValue> = {
  async list(filter) {
    if (filter) {
      return database.sensorValues.filter(filter);
    }
    return database.sensorValues;
  },

  async create(data) {
    const timestamp = Date.now();
    const value: SensorValue = {
      ...data,
      timestamp,
    };
    database.sensorValues.push(value);
    return value;
  },

  async read(timestamp) {
    const value = database.sensorValues.find((value) => value.timestamp === timestamp);
    if (!value) {
      throw new Error(`Failed to find SensorValue with timestamp '${timestamp}'`);
    }
    return value;
  },

  async update(timestamp, data) {
    const index = database.sensorValues.findIndex((value) => value.timestamp === timestamp);
    if (!index) {
      throw new Error(`Failed to find SensorValue with timestamp '${timestamp}'`);
    }
    const value = { ...data, timestamp,  };
    database.sensorValues[index] = value;
    return value;
  },

  async delete(timestamp) {},
};
