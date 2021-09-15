import { ErrorCode, appErrorMessages } from "./errorCodes";

export class AppError extends Error {
  code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message || appErrorMessages[code]);
    this.code = code;
  }
}
