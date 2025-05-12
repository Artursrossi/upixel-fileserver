import { z } from "zod";

export const envSchema = z.object({
  /* APP */
  PORT: z.coerce.number().default("1220"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  /* SECRETS */
  UPIXEL_FILESERVER_CONTENT_DIRECTORY: z.string(),
  UPIXEL_FILESERVER_KEY: z.string(),
});
