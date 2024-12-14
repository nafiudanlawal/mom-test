import { database } from "../database";
import { autoIncrement } from "../utils/identifiers";
import { Repository } from "./_repository";

export type SensorValue = {
  id: number;
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
    const id = autoIncrement(database.sensorValues.map((value) => value.id));
    const value: SensorValue = {
      id,
      ...data,
    };
    database.sensorValues.push(value);
    return value;
  },

  async read(id) {
    const value = database.sensorValues.find((value) => value.id === id);
    if (!value) {
      throw new Error(`Failed to find SensorValue with id '${id}'`);
    }
    return value;
  },

  async update(id, data) {
    const index = database.sensorValues.findIndex((value) => value.id === id);
    if (!index) {
      throw new Error(`Failed to find SensorValue with id '${id}'`);
    }
    const value = { id, ...data };
    database.sensorValues[index] = value;
    return value;
  },

  async delete(id) {},
};
