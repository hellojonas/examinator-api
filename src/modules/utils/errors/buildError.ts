import { ErrorCode } from "./errorCodes";
import { AppError } from "./errors";

export function buildError(error: any): AppError {
  if ((<any>error).name instanceof AppError) {
    return error;
  }

  const err = new AppError(ErrorCode.INTERNAL_ERROR);
  err.cause = error;

  return err;
}
