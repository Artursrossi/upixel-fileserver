import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

async function checkTempFolderExpirations(app) {
  try {
    const contentDirectory = process.env.UPIXEL_FILESERVER_CONTENT_DIRECTORY;
    const fileExpirationHours = 24;

    /* Verify if temp directory exists */
    const tempDirectory = path.join(contentDirectory, "temp");
    const hasDirectory = fs.existsSync(tempDirectory);
    if (!hasDirectory) {
      app.log.error(`Temp directory does not exist: ${tempDirectory}`);
      return;
    }

    /* Read all files inside temp directory */
    const tempDirectoryFiles = await fsPromises.readdir(tempDirectory);

    /* Define expiration date tolerance */
    const expirationDateTolerance = new Date();
    expirationDateTolerance.setTime(
      expirationDateTolerance.getTime() - 1000 * 60 * 60 * fileExpirationHours
    );

    /* For each file, verify if file has expired */
    for (const file of tempDirectoryFiles) {
      const filePath = path.join(tempDirectory, file);
      const fileStat = await fsPromises.stat(filePath);

      /* If file createdDate is older than expiration hours, delete file */
      const fileCreatedAt = new Date(fileStat.birthtime);
      if (expirationDateTolerance > fileCreatedAt) {
        fs.unlinkSync(filePath);
        app.log.info(`File deleted because of expiration date: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export function tempFolderExpirationsChecker(app) {
  const revalidateTime = 1000 * 60 * 60 * 6; // 6 horas

  /* Execute one time (on startup) */
  new Promise((resolve, reject) => {
    checkTempFolderExpirations(app)
      .then(() => resolve())
      .catch(() => reject());
  });

  /* Execute function each time interval */
  setInterval(async () => {
    await checkTempFolderExpirations(app);
  }, revalidateTime);
}
