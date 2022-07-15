/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import expressPinoLogger from "express-pino-logger";
import pino from "pino";
import { logger } from "../logger";

export const loggerMiddleware = expressPinoLogger({
  logger,
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
});
