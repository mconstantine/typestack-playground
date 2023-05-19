import { createExpressServer } from "routing-controllers";
import { env } from "./env";

const app = createExpressServer({
  routePrefix: "/api",
  controllers: [],
});

app.listen(env.SERVER_PORT, () =>
  console.log(`Server ready on port ${env.SERVER_PORT}`)
);
