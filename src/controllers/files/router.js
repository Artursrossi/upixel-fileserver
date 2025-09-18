import { isAuthenticated } from "../../middlewares/is-authenticated.js";
import { listFiles } from "./list.js";
import { uploadFile } from "./upload.js";
import { confirmFile } from "./confirm.js";
import { cancelFile } from "./cancel.js";
import { deleteFile } from "./delete.js";

export async function filesController(app) {
  /* Protected Routes */
  app.get("/files", { preHandler: [isAuthenticated] }, listFiles);
  app.post(
    "/upload",
    {
      preHandler: [isAuthenticated],
      config: {
        rateLimit: {
          max: 20,
          timeWindow: 1000 * 60 * 10, // 10 minutes
        },
      },
    },
    uploadFile
  );
  app.post(
    "/confirm/:filename",
    { preHandler: [isAuthenticated] },
    confirmFile
  );
  app.delete(
    "/cancel/:filename",
    { preHandler: [isAuthenticated] },
    cancelFile
  );
  app.delete("/file/:filename", { preHandler: [isAuthenticated] }, deleteFile);
}
