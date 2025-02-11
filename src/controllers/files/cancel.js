import fs from "fs";
import path from "path";
import { z } from "zod";

const cancelFileParams = z.object({
  filename: z
    .string()
    .min(1)
    .regex(/^((?!(\/|\\)).)*$/, "Invalid filename"),
});

export async function cancelFile(request, reply) {
  const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;
  const { filename } = cancelFileParams.parse(request.params);

  /* Verify if file exist */
  const filePath = path.join(contentDirectory, "temp", filename);
  const hasFile = fs.existsSync(filePath);
  if (!hasFile)
    return reply
      .status(400)
      .send({ message: "File already confirmed, or deleted" });

  /* Delete file */
  fs.unlinkSync(filePath);

  return reply.status(200).send({ message: "Canceled" });
}
