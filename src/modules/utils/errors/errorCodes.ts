export enum ErrorCode {
  INVALID_ID_PARAM = "#1000",
  RECORD_NOT_FOUND = "#1001",
  INVALID_MODEL_DATA = "#1002",
  DUPLICATED_KEY = "#1003",
  INTERNAL_ERROR = "#1004",
}

export const appErrorMessages: { [key in ErrorCode]: string } = {
  [ErrorCode.INVALID_ID_PARAM]: "Invalid ID parameter",
  [ErrorCode.RECORD_NOT_FOUND]: "Record not found",
  [ErrorCode.INVALID_MODEL_DATA]: "One or more model fields are invalid",
  [ErrorCode.DUPLICATED_KEY]:
    "One or more Duplicated field that is supposed to be unique",
  [ErrorCode.INTERNAL_ERROR]: "Internal server error",
};
