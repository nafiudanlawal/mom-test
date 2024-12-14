import Koa from "koa";
import router from "./router";
import logger from "koa-logger";
import { config } from "./config";
import { seed } from "./seed";
import { bodyParser } from "@koa/bodyparser";
import { z } from "zod";

const app = new Koa();

// Global error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 400
    if (err instanceof z.ZodError) {
      ctx.body = {
        message: "Validation error.",
        errors: err.issues,
      };

    } else if (err instanceof Error) {
      ctx.body = {
        message: err.message,
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        message: "An unknown error occurred.",
      };
    }
  }
});

app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(config.PORT);

const baseUrl = `http://localhost:${config.PORT}`;

console.log(
  [
    `Listening on ${baseUrl}`,
    "",
    "Routes:",
    ...router.stack.map(
      (route) => `=> ${route.methods} ${baseUrl}${route.path}`
    ),
  ].join("\n")
);

seed();
