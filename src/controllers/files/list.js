import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

import { folders } from "../../config/folders.js";

export async function listFiles(request, reply) {
  const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;
  const files = [];

  /* For each folder, read all files */
  for (const folder of folders) {
    /* Define directory, and verify if directory exists */
    const directory = path.join(contentDirectory, folder);
    const hasDirectory = fs.existsSync(directory);
    if (!hasDirectory) continue;

    /* Read all files inside directory */
    const directoryFiles = await fsPromises.readdir(directory);

    /* For each file, show metadata (size and created date) */
    for (const file of directoryFiles) {
      const filePath = path.join(directory, file);
      const fileStat = await fsPromises.stat(filePath);

      files.push({
        filename: file,
        size: `${Math.round(fileStat.size / 1024)} KB`,
        createdAt: fileStat.birthtime,
      });
    }
  }

  return reply.status(200).send({ message: "OK", files });
}
