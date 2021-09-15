import { Handler, NextFunction, Request, Response } from "express";

type callBackFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const tryCatch = (fn: callBackFn) => {
  const executor: Handler = async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return executor;
};
