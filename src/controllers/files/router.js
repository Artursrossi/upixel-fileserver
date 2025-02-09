import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
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
          max: 12,
          timeWindow: "1 minute",
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
