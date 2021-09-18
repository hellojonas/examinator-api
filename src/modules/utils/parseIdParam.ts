import { AppError, ErrorCode } from "./errors";

export const parseIdParam = (id: number | string) => {
  if (!id || isNaN(+id)) {
    throw new AppError(ErrorCode.INVALID_ID_PARAM, "Invalid ID parameter");
  }

  return +id;
};
