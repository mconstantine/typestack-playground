import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database:
    process.env["NODE_ENV"] === "test" ? env.DB_TEST_DATABASE : env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: ["./src/migration/*.ts"],
  subscribers: [],
});
