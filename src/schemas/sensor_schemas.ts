import { z } from "zod";

// SensorValue schema
export const SensorValueSchema = z.object({
	timestamp: z.number(),
	sensor_id: z.number(),
	values: z.array(z.number()),
});

// Sensor schema
export const SensorSchema = z.object({
	name: z.string(),
	values: z.array(SensorValueSchema).optional(), 
});
