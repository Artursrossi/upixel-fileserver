import crypto from "crypto";
import util from "util";
import { pipeline } from "stream";
import fs from "fs";
import path from "path";
import { z } from "zod";

const pump = util.promisify(pipeline);

const uploadImageQuerySchema = z.object({
  prefix: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9]+$/, "Invalid prefix")
    .optional(),
});

export async function uploadImage(request, reply) {
  const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;
  const { prefix } = uploadImageQuerySchema.parse(request.query);

  /* Get part from @fastify/multipart */
  const part = await request.file();

  /* Accept only Image format */
  if (!part.mimetype.startsWith("image/")) {
    return reply
      .status(400)
      .send({ message: "Invalid file format (Needs to be an image)" });
  }

  /* Remove special caracteres from part.filename */
  const formattedPartFilename = part.filename.replace(/[^a-zA-Z0-9.']/gi, "");

  /* Define unique name for file */
  const fileHash = crypto.randomBytes(10).toString("hex");
  const fileName = prefix
    ? `${prefix}-${fileHash}-${formattedPartFilename}`
    : `${fileHash}-${formattedPartFilename}`;

  /* Save file */
  const fileDirectory = path.join(contentDirectory, fileName);
  await pump(part.file, fs.createWriteStream(fileDirectory));

  return reply.status(201).send({ message: "CREATED", filename: fileName });
}
