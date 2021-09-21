import { ErrorRequestHandler, Handler } from "express";
import { AppError, appErrorMessages, ErrorCode } from "./utils/errors";

export const globalErrorHanlder: ErrorRequestHandler = (err, _, res, _2) => {
  let status = 500;
  const _err = err as AppError;

  const code = _err.code ? _err.code : ErrorCode.INTERNAL_ERROR;
  // console.log(ErrorCode.INTERNAL_ERROR);

  const message =
    code === ErrorCode.INTERNAL_ERROR
      ? appErrorMessages[ErrorCode.INTERNAL_ERROR]
      : _err.message;

  // const temp = new DuplicatedKey();
  // console.log(temp instanceof DuplicatedKey);

  if (err.name === "RecordNotFound") {
    status = 404;
  } else if (
    err.name === "RecordNotFound" ||
    err.name === "InvalidModelData" ||
    err.name === "InvalidIDParameter" ||
    err.name === "DuplicatedKey"
  ) {
    status = 400;
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
