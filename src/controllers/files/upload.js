import crypto from "crypto";
import fs from "fs";
import path from "path";
import util from "util";
import { pipeline } from "stream";
import { z } from "zod";

const pump = util.promisify(pipeline);

const uploadFileQuerySchema = z.object({
  prefix: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9]+$/, "Invalid prefix")
    .optional(),
});

export async function uploadFile(request, reply) {
  const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;
  const { prefix } = uploadFileQuerySchema.parse(request.query);

  /* Get part from @fastify/multipart */
  const part = await request.file();

  /* Get file format */
  const fileFormatArr = part.filename.split(".");
  if (fileFormatArr.length <= 1)
    return reply.status(400).send({ message: "Invalid file format" });
  const fileFormat = fileFormatArr[fileFormatArr.length - 1];

  /* Define unique name for file */
  const fileHash = crypto.randomBytes(10).toString("hex");
  const fileName = prefix
    ? `upixel-${prefix}-${fileHash}.${fileFormat}`
    : `upixel-${fileHash}.${fileFormat}`;

  /* Verify if already exist a file with the same name */
  const filePath = path.join(contentDirectory, "temp", fileName);
  const hasDuplicatedFilename = fs.existsSync(filePath);
  if (hasDuplicatedFilename)
    return reply.status(400).send({ message: "Duplicated filename" });

  /* Save file */
  await pump(part.file, fs.createWriteStream(filePath));

  /* Delete file if size limit is reach (this verification needs to be after pump function) */
  if (part.file.truncated) {
    fs.unlinkSync(filePath);
    return reply.status(400).send({ message: "File too large" });
  }

  return reply.status(201).send({ message: "CREATED", filename: fileName });
}
