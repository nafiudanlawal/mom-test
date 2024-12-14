import { z, ZodError } from "zod";
import { SensorValuesRepository } from "../repositories/sensor_values_repository";
import { Sensor, SensorsRepository } from "../repositories/sensors_repository";
import { Controller } from "./_controller";
import { SensorSchema } from "../schemas/sensor_schemas";
import { mean } from "../utils/mean";

export const SensorsController: Controller = {
	async list(ctx) {
		const list = await SensorsRepository.list();
		ctx.body = list;
	},

	async read(ctx) {
		const { id } = z
			.object({
				id: z.coerce.number().nonnegative(),
			})
			.parse(ctx.params);

		const sensor = await SensorsRepository.read(id);
		const sensorValues = await SensorValuesRepository.list(
			(value) => value.sensor_id === id
		);
		const values = sensorValues.map(value => {
			return[
				value.timestamp,
				mean(value.values)

			]
		})

		ctx.body = {
			...sensor,
			values,
		};
	},

	async update(ctx) {
		const { id } = z
			.object({
				id: z.coerce.number().nonnegative(),
			})
			.parse(ctx.params);

		// validate request body
		const result = SensorSchema.safeParse(ctx.request.body);
		if (!result.success) {
			ctx.status = 400;
			ctx.body = {
				message: "Invalid sensor data.",
				errors: result.error.issues,
			};
			return;
		}

		// respond to valid request
		const sensor = await SensorsRepository.update(id, result.data);
		ctx.body = {
			...sensor,
		};

	},

	async delete(ctx) {
		const { id } = z
			.object({
				id: z.coerce.number().nonnegative(),
			})
			.parse(ctx.params);

		// Delete sensor from database
		await SensorsRepository.delete(id);
		ctx.status = 204;
	},

};
