import fs from "fs";
import path from "path";

import { folders } from "../config/folders.js";

export async function generateDirectoryStructure(app) {
  const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;

  /* For each folder, verify if directory already exists, and generate it if necessary */
  for (const folder of folders) {
    const directory = path.join(contentDirectory, folder);
    const hasDirectory = fs.existsSync(directory);
    if (!hasDirectory) {
      fs.mkdirSync(directory);
      app.log.info(`Generated ${folder} directory: ${directory}`);
    }
  }
}
