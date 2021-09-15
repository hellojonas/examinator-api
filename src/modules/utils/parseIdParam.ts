import { AppError } from "./AppError";
import { ErrorCode } from "./errorCodes";

export const parseIdParam = (id: number | string) => {
  if (!id || isNaN(+id)) {
    throw new AppError(ErrorCode.INVALID_ID_PARAM, "Invalid ID parameter");
  }

  return +id;
};
