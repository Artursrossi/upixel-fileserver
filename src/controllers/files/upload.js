import crypto from "crypto";
import util from "util";
import { pipeline } from "stream";
import fs from "fs";
import path from "path";

const pump = util.promisify(pipeline);

export async function uploadImage(request, reply) {
  const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;

  /* Get part from @fastify/multipart */
  const part = await request.file();

  /* Define unique name for file */
  const fileHash = crypto.randomBytes(10).toString("hex");
  const fileName = `${fileHash}-${part.filename}`;

  /* Save file */
  const fileDirectory = path.join(contentDirectory, fileName);
  await pump(part.file, fs.createWriteStream(fileDirectory));

  return reply.status(201).send({ message: "CREATED", filename: fileName });
}
