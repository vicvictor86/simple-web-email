import { AppError } from "@shared/error/AppError";
import { IncomingMessage, ServerResponse } from "http";

function errorHandler(err: Error, req: IncomingMessage, res: ServerResponse): void {
  if (err instanceof AppError) {
    console.error(err.stack);
    res.statusCode = err.statusCode;
    res.end(JSON.stringify({ status: 'error', message: err.message }));
    return;
  }

  console.error(err.stack);

  res.statusCode = 500;
  res.end(JSON.stringify({ status: 'error', message: 'Internal Server Error' }));
}

export { errorHandler };