import { ErrorCode, appErrorMessages } from "./errorCodes";

export class AppError extends Error {
  code: ErrorCode;
  internal: boolean;

  constructor(code: ErrorCode, message?: string) {
    super(message || appErrorMessages[code]);
    this.code = code;
    this.name = "AppError";
  }
}

/* Model related errors */

export abstract class ModelError extends AppError {
  constructor(code: ErrorCode, message?: string) {
    super(code, message);
    this.internal = false;
    this.name = "ModelError";
  }
}

export class RecordNotFound extends ModelError {
  constructor(message?: string) {
    super(ErrorCode.RECORD_NOT_FOUND, message);
    this.name = "RecordNotFound";
  }
}

export class DuplicatedKey extends ModelError {
  constructor(message?: string) {
    super(ErrorCode.DUPLICATED_KEY, message);
    this.name = "DuplicatedKey";
  }
}

export class InvalidModelData extends ModelError {
  constructor(message?: string) {
    super(ErrorCode.INVALID_MODEL_DATA, message);
    this.name = "InvalidModelData";
  }
}

export class InvalidIDParameter extends ModelError {
  constructor(message?: string) {
    super(ErrorCode.INVALID_ID_PARAM, message);
    this.name = "InvalidIDParameter";
  }
}
