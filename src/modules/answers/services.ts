import { FindManyResult, IAnswer } from "src/types";
import { DeepPartial, FindManyOptions, getRepository, Like } from "typeorm";
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
    throw new InvalidModelData("Answer 'value' is empty.");
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

    if (!data.value || data.value.length === 0) {
      throw new InvalidModelData("'value' has invalid value");
    }

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
): Promise<FindManyResult<Answer> | never> {
  try {
    const answers = await getRepository(Answer).find(option);
    const total = await count();
    return {
      data: answers,
      total,
    };
  } catch (error) {
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
}

export async function search(
  text: string,
  paginate?: { skip?: number; take?: number }
): Promise<FindManyResult<Answer> | never> {
  if (!text || text.length === 0) {
    throw new AppError(
      ErrorCode.INVALID_MODEL_DATA,
      "Serch text must be at least 3 characters long"
    );
  }
  const skip = paginate?.skip || 0;
  const take = paginate?.take || 15;
  const repository = getRepository(Answer);

  const answers = await repository.find({
    where: { value: Like(`%${text}%`) },
    skip,
    take,
  });
  const total = await repository.count({
    where: { value: Like(`%${text}%`) },
  });
  return { data: answers, total };
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

export async function count(
  options?: FindManyOptions<Answer>
): Promise<number> {
  try {
    return await getRepository(Answer).count(options);
  } catch (error) {
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
}
