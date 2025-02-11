import crypto from "crypto";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { z } from "zod";
import mime from "mime-types";

const confirmFileParams = z.object({
  filename: z
    .string()
    .min(1)
    .regex(/^((?!(\/|\\)).)*$/, "Invalid filename"),
});

export async function confirmFile(request, reply) {
  const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;
  const { filename } = confirmFileParams.parse(request.params);

  /* Declare file path */
  const fileTempPath = path.join(contentDirectory, "temp", filename);

  /* Verify if file exist */
  const hasFile = fs.existsSync(fileTempPath);
  if (!hasFile)
    return reply
      .status(400)
      .send({ message: "File already confirmed, or deleted" });

  /* Define file mime-type */
  const fileMimeType = mime.lookup(fileTempPath);
  let folder = "generics";

  if (fileMimeType) {
    /* If file is an image, set images folder */
    if (fileMimeType.startsWith("image")) folder = "images";

    /* If file is an image, set documents folder */
    if (
      fileMimeType.startsWith("application") ||
      fileMimeType.startsWith("text")
    )
      folder = "documents";

    /* If file is an image, set videos folder */
    if (fileMimeType.startsWith("video")) folder = "videos";
  }

  /* Define final path */
  let fileFinalPath = path.join(contentDirectory, folder, filename);
  const hasDuplicatedFilename = fs.existsSync(fileFinalPath);

  /* Verify if already exist a file with this name (There is a minimal chance to execute this block) */
  if (hasDuplicatedFilename) {
    /* Separate name and format */
    const fileFormatArr = filename.split(".");
    if (fileFormatArr.length <= 1)
      return reply.status(400).send({ message: "Invalid file format" });

    /* Generate random hash */
    const fileHash = crypto.randomBytes(4).toString("hex");

    /* Add hash to filename */
    fileFormatArr.splice(fileFormatArr.length - 1, 0, fileHash);
    fileFormatArr.splice(fileFormatArr.length - 1, 0, "."); // Return removed dot

    /* Join array with the new name */
    const newFilename = fileFormatArr.join("");

    /* Set new path */
    fileFinalPath = path.join(contentDirectory, folder, newFilename);
  }

  /* Move file to corresponding directory */
  await fsPromises.rename(fileTempPath, fileFinalPath);
  return reply.status(200).send({ message: "OK" });
}
