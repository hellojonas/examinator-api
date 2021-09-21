import { ErrorRequestHandler, Handler } from "express";
import { ValidationError } from "yup";
import { AppError, appErrorMessages, ErrorCode } from "./utils/errors";

export const globalErrorHanlder: ErrorRequestHandler = (err, _, res, _2) => {
  let status = 500;
  const _err = err as AppError;

  let code = _err.code ? _err.code : ErrorCode.INTERNAL_ERROR;

  let message =
    code === ErrorCode.INTERNAL_ERROR
      ? appErrorMessages[ErrorCode.INTERNAL_ERROR]
      : _err.message;

  if (err.name === "RecordNotFound") {
    status = 404;
  } else if (
    err.name === "RecordNotFound" ||
    err.name === "InvalidModelData" ||
    err.name === "InvalidIDParameter" ||
    err.name === "DuplicatedKey"
  ) {
    status = 400;
  } else if (err instanceof ValidationError) {
    status = 400;
    message = err.message;
    code = ErrorCode.INVALID_MODEL_DATA;
  }

  const resError: any = {
    message,
    code,
  };

  if (process.env.NODE_ENV === "development") {
    resError.error = err;
    resError.stack = err.stack;
  }

  res.status(status).json(resError);
};

export const notFound: Handler = (_, res) => {
  res.status(404).json({
    message: "Invalid endpoint",
  });
};
