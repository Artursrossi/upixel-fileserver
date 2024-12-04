import Fastify from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";

import { filesController } from "./controllers/files/router.js";
import { envSchema } from "./config/env.js";

const app = Fastify({
  logger: true,
  disableRequestLogging: true,
});

envSchema.parse(process.env);

await app.register(fastifyRateLimit, {
  global: true,
  max: 50,
  timeWindow: 1000 * 30, // 30 segundos
});

await app.register(fastifyStatic, {
  root: process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY,
  prefix: "/",
});

await app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/*  Index Route */
app.get("/", async (request, reply) => {
  return reply.status(200).send({
    message: "uPixel File Server Module developed by Artur Schincariol Rossi",
  });
});

/* Controllers */
app.register(filesController);

try {
  await app.listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  });
} catch (error) {
  app.log.fatal(error);
  process.exit(1);
}
