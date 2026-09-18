import type { ErrorRequestHandler, Response } from "express";

// An error we threw on purpose (not ready, unknown route, and so on).
// status = HTTP number. code = short machine name. message = human text.
export class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
  }
}

// Every failure looks the same on the wire:
// { "error": { "code": "...", "message": "..." } }
export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
): void {
  res.status(status).json({ error: { code, message } });
}

// Last Express handler. Turns any leftover error into that JSON shape.
// Never send a stack trace — that would leak file paths to the client.
export const httpErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  // Too late to write a new body; let Express finish shutting down.
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof HttpError) {
    sendError(res, err.status, err.code, err.message);
    return;
  }

  // Express's JSON parser failed (not JSON, or the body was too large).
  if (isBodyParserError(err)) {
    sendError(
      res,
      400,
      "MALFORMED_JSON",
      "The request body is not valid JSON.",
    );
    return;
  }

  // Unknown throw: keep the message generic so we do not leak internals.
  sendError(res, 500, "INTERNAL_ERROR", "An unexpected error occurred.");
};

type BodyParserError = {
  status: number;
  type: string;
};

function isBodyParserError(err: unknown): err is BodyParserError {
  if (typeof err !== "object" || err === null) {
    return false;
  }

  if (!("status" in err) || !("type" in err)) {
    return false;
  }

  return typeof err.status === "number" && typeof err.type === "string";
}
