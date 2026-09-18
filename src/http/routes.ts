import express, { type Express } from "express";

import type { AppConfig } from "../config.ts";
import { httpErrorHandler, sendError } from "./errors.ts";

export { httpErrorHandler, HttpError, sendError } from "./errors.ts";

export type HttpAppDependencies = {
  config: AppConfig;
  // False until the caller calls markReady(). Health still answers; other
  // routes return 503 so commands cannot run against a half-open process.
  isReady: () => boolean;
};

// Build the Express app. Middleware runs in the order it is registered.
export function createHttpApp(dependencies: HttpAppDependencies): Express {
  const { config, isReady } = dependencies;
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json());

  // Health is allowed even when we are not ready. That is how you ask
  // "is the process up?" without talking to sessions yet.
  app.get("/health", (_req, res) => {
    res.status(200).json({
      ready: isReady(),
      mode: config.workerMode,
    });
  });

  app.use((_req, res, next) => {
    if (isReady()) {
      next();
      return;
    }

    sendError(
      res,
      503,
      "NOT_READY",
      "The server is not ready to accept requests.",
    );
  });

  // Session routes arrive in later tasks. Until then, a known-good request
  // that is not /health is simply "no such route".
  app.use((_req, res) => {
    sendError(res, 404, "NOT_FOUND", "The requested route was not found.");
  });

  app.use(httpErrorHandler);
  return app;
}
