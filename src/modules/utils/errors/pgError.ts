import { DatabaseError } from "pg";
import { DuplicatedKey, InvalidModelData, ModelError } from "./errors";

export function parsePgError(error: DatabaseError): ModelError | undefined {
  const { code, detail } = error;

  const match = detail && /(?:\()(\w+)(?:\))/g.exec(detail);
  const field = match && match[1];

  if (code === "23505") {
    const message = `${field} already exists`;
    return new DuplicatedKey(message);
  } else if (code === "22P02") {
    // const message = `${field} has invalid value`;
    const message = "One or more values has invalid text represntation";
    return new InvalidModelData(message);
  }
}

export function isPgError(error: any): boolean {
  const { code, length, severity } = error as DatabaseError;

  return !!code && !!length && !!severity;
}
