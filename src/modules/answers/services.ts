import { IAnswer } from "src/types";
import { DeepPartial, FindManyOptions, getRepository } from "typeorm";
import Answer from "./Answer.entity";
import {
  AppError,
  InvalidModelData,
  isPgError,
  parsePgError,
  RecordNotFound,
} from "../utils/errors";
import { DatabaseError } from "pg";
import { ErrorCode } from "../utils/errors";

export async function addAnswer(data: IAnswer): Promise<Answer | never> {
  const { value } = data;

  if (!value) {
    throw new InvalidModelData("Answer value is empty.");
  }

  try {
    const repository = getRepository(Answer);
    const answer = repository.create({ value });
    const newAnswer = await repository.save(answer);

    return newAnswer;
  } catch (error) {
    if (isPgError(error)) {
      throw parsePgError(error as DatabaseError);
    }

    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
}

export async function getOne(id: number): Promise<Answer | never> {
  try {
    const answer = await getRepository(Answer).findOne(id);

    if (!answer) {
      throw new RecordNotFound("Answer Not Found");
    }

    return answer;
  } catch (error) {
    if ((<any>error).name === "RecordNotFound") {
      throw error;
    }
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
}

export async function update(
  id: number,
  data: DeepPartial<Answer>
): Promise<Answer | null | never> {
  try {
    await getOne(id);
    const res = await getRepository(Answer).update({ id }, { ...data, id });

    if (res.affected === 0) {
      return null;
    }

    return getRepository(Answer).create({ ...data, id });
  } catch (error) {
    if ((<any>error).name === "RecordNotFound") {
      throw error;
    } else if (isPgError(error)) {
      throw parsePgError(error as DatabaseError);
    }
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
}

export async function getAll(
  option?: FindManyOptions<Answer>
): Promise<Answer[]> {
  try {
    return getRepository(Answer).find(option);
  } catch (error) {
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
}

export async function deleteOne(id: number): Promise<Answer | never> {
  try {
    const answer = await getOne(id);
    await getRepository(Answer).remove(answer);
    return answer;
  } catch (error) {
    if ((<any>error).name === "InvalidIDparameter") {
      throw error;
    }
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
}

export async function count(): Promise<number> {
  try {
    return await getRepository(Answer).count();
  } catch (error) {
    if ((<any>error).name === "InvalidIDparameter") {
      throw error;
    }
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
}
