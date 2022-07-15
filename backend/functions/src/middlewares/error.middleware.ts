import { Request, Response } from "express";
import { HttpError } from "http-errors";
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { Service } from "typedi";
import { logger } from "../logger";

@Middleware({ type: "after" })
@Service()
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(
    error: Error,
    _req: Request,
    res: Response,
    next: () => any
  ): void {
    if (!error) {
      next();

      return;
    }

    let statusCode = 500;
    let errorMessage = error.message || "Internal Error";

    if (error instanceof HttpError) {
      statusCode = (error as HttpError).statusCode;
    }

    if ((error as any).response) {
      const errorResponse = (error as any).response || {};

      errorMessage =
        (errorResponse.body || {}).message ||
        (errorResponse.body || {}).description ||
        error.message ||
        "Internal Server Error";
      statusCode = errorResponse.statusCode || errorResponse.status || 500; // axios or got error type with response
      res.setHeader("X-Debug-Error-Message", JSON.stringify(errorMessage));
    }

    if (error.name) {
      res.setHeader("X-Debug-Error-Name", error.name);
    }

    const response = {
      message: errorMessage,
      errors: (error as any)?.errors,
      statusCode,
    };

    logger.error(response);
    res.setHeader("X-Debug-Error-Status", statusCode);
    res.setHeader("Content-Type", "application/json");
    res.status(statusCode).json(response);
  }
}
