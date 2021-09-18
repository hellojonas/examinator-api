import { ErrorRequestHandler, Handler } from "express";
import { AppError } from "./utils/errors";

export const globalErrorHanlder: ErrorRequestHandler = (err, _, res, _2) => {
  let status = 500;
  let message = err.message || "Internal Server Error";
  const { code } = err as AppError;

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

  const resError: any = { message, code };

  if (process.env.NODE_ENV === "development") {
    resError.error = err;
  }

  res.status(status).json(resError);
};

export const notFound: Handler = (_, res) => {
  res.status(404).json({
    message: "Invalid endpoint",
  });
};
