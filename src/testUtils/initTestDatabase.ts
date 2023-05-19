import Container from "typedi";
import { Database } from "../services/Database";

export async function initTestDatabase() {
  await Container.get(Database).use(() => Promise.resolve());
}
