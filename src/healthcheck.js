import fs from "fs";
import path from "path";

import { folders } from "./config/folders.js";

export async function healthCheck(request, reply) {
  /* Dependencies */
  const isFilesystemOk = checkFilesystemStatus(reply);

  /* Variable for easily add other dependencies */
  const isHealth = isFilesystemOk;
  const statusCode = isHealth ? 200 : 503;
  const status = isHealth ? "HEALTHY" : "UNHEALTHY";

  return reply.status(statusCode).send({
    status,
    uptime: formatUptime(process.uptime()),
    timestamp: new Date().toISOString(),
    dependencies: {
      filesystem: isFilesystemOk ? "OK" : "DOWN",
    },
  });
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}d ${hrs}h ${mins}m ${secs}s`;
}

function checkFilesystemStatus(response) {
  try {
    const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;

    /* Verify if content directory exists */
    const hasContentDirectory = fs.existsSync(contentDirectory);
    if (!hasContentDirectory) return false;

    /* For each folder, verify if directory already exists */
    if (hasContentDirectory) {
      for (const folder of folders) {
        const directory = path.join(contentDirectory, folder);
        const hasDirectory = fs.existsSync(directory);
        if (!hasDirectory) return false;
      }
    }

    return true;
  } catch (error) {
    /* Log error */
    response.log.error({
      code: error.code,
      statusCode: error.statusCode,
      message: error.message,
    });

    return false;
  }
}
