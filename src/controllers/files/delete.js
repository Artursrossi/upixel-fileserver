import fs from "fs";
import path from "path";
import { z } from "zod";

import { folders } from "../../config/folders.js";

const deleteFileParams = z.object({
  filename: z
    .string()
    .min(1)
    .regex(/^((?!(\/|\\)).)*$/, "Invalid filename"),
});

export async function deleteFile(request, reply) {
  const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;
  const { filename } = deleteFileParams.parse(request.params);

  /* Check all folder to verify if file exist */
  for (const folder of folders) {
    const filePath = path.join(contentDirectory, folder, filename);
    const hasFile = fs.existsSync(filePath);

    /* Delete file */
    if (hasFile) {
      fs.unlinkSync(filePath);
      return reply.status(200).send({ message: "DELETED" });
    }
  }

  return reply.status(400).send({ message: "File not found" });
}
