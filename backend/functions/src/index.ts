import "dotenv/config";
import "reflect-metadata";
import { runWith } from "firebase-functions";
import { join } from "path";
import { json } from "express";
import { createExpressServer, useContainer } from "routing-controllers";
import Container from "typedi";
import { ErrorHandler, loggerMiddleware } from "./middlewares";

useContainer(Container);

const app = createExpressServer({
  validation: {
    validationError: {
      target: false,
      value: false,
    },
  },
  classTransformer: true,
  defaultErrorHandler: false,
  controllers: [join(__dirname, "/controllers/*.controller.js")],
  middlewares: [ErrorHandler],
  routePrefix: "/api",
  cors: true,
});

app.use(loggerMiddleware);
app.use(json());

export const vascueStarknetApi = runWith({
  timeoutSeconds: 540,
  memory: "512MB",
})
    .region("europe-west3")
    .https.onRequest(app);
