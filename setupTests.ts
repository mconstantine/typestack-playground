import Container from "typedi";
import { Database } from "./src/services/Database";

export default async function setupTests() {
  await Container.get(Database).use((db) => db.runMigrations());
}
