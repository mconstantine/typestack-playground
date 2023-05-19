import { createExpressServer } from "routing-controllers";
import { env } from "./env";
import Container from "typedi";
import { Database } from "./services/Database";
import { UserController } from "./controllers/UserController";

const app = createExpressServer({
  routePrefix: "/api",
  controllers: [UserController],
});

Container.get(Database).use(() => {
  app.listen(env.SERVER_PORT, () =>
    console.log(`Server ready on port ${env.SERVER_PORT}`)
  );

  return Promise.resolve();
});
