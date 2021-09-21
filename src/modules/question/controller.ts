import { Handler } from "express";
import { IQuestionInput } from "../../types";
import { isValidOrdering, paginate, parseIdParam, tryCatch } from "../utils";
import { InvalidModelData } from "../utils/errors";
import Question from "./Question.entity";
import * as questionServices from "./services";

export const addQuestion: Handler = tryCatch(async (req, res, _) => {
  const { value, answers, correctAnswer, picture, category } =
    req.body as IQuestionInput;

  // if (
  //   !value ||
  //   !answers ||
  //   answers.length === 0 ||
  //   !correctAnswer ||
  //   !picture ||
  //   !category
  // ) {
  //   throw new InvalidModelData(
  //     "One or more fields are empty. {value, answers, correctAnswer, picture, category} cannot be empty"
  //   );
  // }

  const newQuestion = await questionServices.addOne({
    value,
    answers,
    correctAnswer,
    picture,
    category,
  });

  res.status(201).json({ question: newQuestion });
});

export const allQuestions: Handler = async (req, res) => {
  const { limit, skip, order } = req.query as {
    limit: string;
    skip: string;
    order: string;
  };
  const range = paginate({ limit, skip });

  const questions = await questionServices.findAll({
    skip: range.skip,
    take: range.limit,
    order: {
      id: isValidOrdering(order)
        ? (order.toUpperCase() as "ASC" | "DESC")
        : "DESC",
    },
  });
  const count = await questionServices.totalQuestions();

  res.json({ total: count, returned: limit, questions: questions });
};

export const getQuestion: Handler = tryCatch(async (req, res, next) => {
  try {
    const id = parseIdParam(req.params.id);

    const question = await questionServices.findOne(+id);

    res.json({ question });
  } catch (error) {
    next(error);
  }
});

export const updateQuestion: Handler = tryCatch(async (req, res, _) => {
  const id = parseIdParam(req.params.id);

  const updatedQuestion = await questionServices.updateOne(
    id,
    req.body as Question
  );

  res.json({ question: updatedQuestion });
});

export const removeQuestion: Handler = tryCatch(async (req, res, _) => {
  const id = parseIdParam(req.params.id);

  await questionServices.removeOne(+id);

  res.status(210).json(null);
});
