import Fastify from "fastify";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import path from "path";

import { envSchema } from "./config/env.js";
import { folders } from "./config/folders.js";
import { errorHandler } from "./error-handler.js";
import { filesController } from "./controllers/files/router.js";
import { generateDirectoryStructure } from "./services/generateDirectoryStructure.js";

/* Start Fastify */
const app = Fastify({
  logger: true,
  disableRequestLogging: true,
});

/* Validate .env */
envSchema.parse(process.env);

/* Generate necessary sub-directories */
await generateDirectoryStructure(app);

/* Set a custom error handler */
app.setErrorHandler(errorHandler);

/* Global Rate-limit config */
await app.register(fastifyRateLimit, {
  global: true,
  max: 100,
  timeWindow: "1 minute",
});

/* Provide all static files */
const foldersToProvide = folders.map((folder) =>
  path.join(process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY, folder)
);
await app.register(fastifyStatic, {
  root: foldersToProvide,
  prefix: "/",
});

/* Multipart config */
await app.register(fastifyMultipart, {
  limits: {
    fileSize: 1024 * 1024 * 4, // 4MB
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
