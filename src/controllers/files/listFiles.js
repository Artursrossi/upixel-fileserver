import fs from "fs/promises";

export async function listFiles(request, reply) {
  const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;

  /* List all files from a directory */
  const files = await fs.readdir(contentDirectory);

  return reply.status(200).send({ message: "OK", files });
}
