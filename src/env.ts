import { z } from "zod";
import { config } from "dotenv";

config();

const Env = z.object({
  SERVER_PORT: z.coerce.number(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_TEST_DATABASE: z.string(),
  SECRET_TOKEN: z.string(),
});
type Env = z.infer<typeof Env>;

export const env: Env = Env.parse(process.env);
