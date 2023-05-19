import Container from "typedi";
import { Database } from "./src/services/Database";

export default async function teardownTests() {
  return Container.get(Database).destroy();
}
