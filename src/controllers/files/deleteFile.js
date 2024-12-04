import fs from "fs";
import path from "path";

export async function deleteFile(request, reply) {
  const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;
  const { filename } = request.body;

  /* Data Parse */
  if (!filename)
    return reply
      .status(400)
      .send({ message: "Data parse error", fields: ["filename"] });

  /* Verify if file exist */
  const fileDirectory = path.join(contentDirectory, filename);
  const hasFile = fs.existsSync(fileDirectory);
  if (!hasFile) return reply.status(400).send({ message: "File not found" });

  /* Delete file */
  fs.unlinkSync(fileDirectory);

  return reply.status(200).send({ message: "DELETED" });
}
