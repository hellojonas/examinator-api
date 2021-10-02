import { DatabaseError } from "pg";
import {
  DeepPartial,
  FindManyOptions,
  getRepository,
  In,
  ILike,
  getConnection,
  createQueryBuilder,
} from "typeorm";
import {
  AppError,
  ErrorCode,
  InvalidModelData,
  isPgError,
  parsePgError,
  RecordNotFound,
} from "../utils/errors";
import Question, { Category } from "./Question.entity";
import { FindManyResult, IQuestionInput } from "../../types";
import { Answer, answerServices } from "../answers";
import { questionInputSchema, questionUpdateSchema } from "./validation";

export const findAll = async (
  options?: FindManyOptions
): Promise<FindManyResult<Question> | never> => {
  try {
    const questions = await getRepository(Question).find(options);
    const total = await count();

    return {
      data: questions,
      total,
    };
  } catch (_) {
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
};

export async function search(
  text: string,
  paginate?: { skip?: number; take?: number }
): Promise<FindManyResult<Question> | never> {
  if (!text || text.length === 0) {
    throw new AppError(
      ErrorCode.INVALID_MODEL_DATA,
      "Serch text must be at least 3 characters long"
    );
  }
  const skip = paginate?.skip || 0;
  const take = paginate?.take || 15;

  const questions = await getRepository(Question).find({
    where: { value: ILike(`%${text}%`) },
    skip,
    take,
  });
  const total = await count({
    where: { value: ILike(`%${text}%`) },
  });

  return { data: questions, total };
}

export const findOne = async (id: number): Promise<Question | never> => {
  try {
    const question = await getRepository(Question).findOne(id);
    if (!question) {
      throw new RecordNotFound("Question Not Found");
    }
    return question;
  } catch (error) {
    if ((<any>error).name === "RecordNotFound") {
      throw error;
    }
    const err = new AppError(ErrorCode.INTERNAL_ERROR);
    err.cause = error;
    throw err;
  }
};

export const addOne = async (
  data: IQuestionInput
): Promise<Question | never> => {
  const repository = getRepository(Question);

  await questionInputSchema.validate(data);

  try {
    const { data: answers } = await answerServices.getAll({
      where: { id: In(data.answers) },
    });
    const correctAnswer = await answerServices.getOne(data.correctAnswer);
    const category = data.category === "law" ? Category.LAW : Category.SIGNS;
    const question = repository.create({
      ...data,
      answers,
      correctAnswer,
      category,
    });
    const newQuestion = await repository.save(question);

    return newQuestion;
  } catch (error) {
    if (isPgError(error)) {
      throw parsePgError(error as DatabaseError);
    }
    const err = new AppError(ErrorCode.INTERNAL_ERROR);
    err.cause = error;
    throw err;
  }
};

export const removeOne = async (id: number): Promise<Question | never> => {
  const repository = getRepository(Question);
  const question = await findOne(id);
  try {
    await repository.remove(question);
    return question;
  } catch (error) {
    if ((<any>error).name === "RecordNotFound") {
      throw error;
    }
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
};

export const updateOne = async (
  id: number,
  partialData: DeepPartial<Question>
): Promise<Question | null | never> => {
  if (Object.keys(partialData).length === 0) {
    throw new InvalidModelData("Empty update body data");
  }
  await questionUpdateSchema.validate(partialData);

  const repository = getRepository(Question);

  try {
    const res = await repository.update(id, partialData);

    if (res.affected === 0) {
      return null;
    }

    return repository.create({ ...partialData, id });
  } catch (error) {
    if ((<any>error).name === "RecordNotFound") {
      throw error;
    }
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
};

export const count = async (options?: FindManyOptions<Question>) => {
  try {
    return await getRepository(Question).count(options);
  } catch (error) {
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
};

export const random = async (limit?: number) => {
  const questions = await getRepository(Question)
    .createQueryBuilder("question")
    .leftJoinAndSelect("question.answers", "answer")
    .orderBy("RANDOM()")
    .limit(limit || 25)
    .getMany();

  return questions;
};
