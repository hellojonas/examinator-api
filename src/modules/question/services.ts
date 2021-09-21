import { DatabaseError } from "pg";
import { DeepPartial, FindManyOptions, getRepository, In } from "typeorm";
import {
  AppError,
  ErrorCode,
  InvalidModelData,
  isPgError,
  parsePgError,
  RecordNotFound,
} from "../utils/errors";
import Question, { Category } from "./Question.entity";
import { IQuestionInput } from "../../types";
import { answerServices } from "../answers";
import { questionInputSchema, questionUpdateSchema } from "./validation";

export const findAll = async (
  options?: FindManyOptions
): Promise<Question[]> => {
  try {
    return await getRepository(Question).find(options);
  } catch (_) {
    throw new AppError(ErrorCode.INTERNAL_ERROR);
  }
};

export const findOne = async (id: number): Promise<Question | never> => {
  try {
    const question = await getRepository(Question).findOne(id);
    if (!question) {
      throw new RecordNotFound("Question Not Found");
    }
    return question;
  } catch (error) {
    // const err = buildError(error);
    // throw err;
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
    const answers = await answerServices.getAll({
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

export const totalQuestions = async () => await getRepository(Question).count();
