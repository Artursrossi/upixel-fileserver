import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { listFiles } from "./listFiles.js";
import { uploadImage } from "./upload.js";
import { deleteFile } from "./deleteFile.js";

export async function filesController(app) {
  /* Protected Routes */
  app.get("/files", { preHandler: [isAuthenticated] }, listFiles);
  app.post("/upload", { preHandler: [isAuthenticated] }, uploadImage);
  app.delete("/file", { preHandler: [isAuthenticated] }, deleteFile);
}
