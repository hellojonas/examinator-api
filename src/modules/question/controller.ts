import { Handler } from "express";
import { IQuestionInput } from "../../types";
import { isValidOrdering, paginate, parseIdParam, tryCatch } from "../utils";
import Question from "./Question.entity";
import * as questionServices from "./services";

export const addQuestion: Handler = tryCatch(async (req, res, _) => {
  const { value, answers, correctAnswer, picture, category } =
    req.body as IQuestionInput;

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
  const { limit, skip, order, q } = req.query as {
    limit: string;
    skip: string;
    order: string;
    q: string;
  };
  const range = paginate({ take: limit, skip });
  const options = {
    skip: range.skip,
    take: range.take,
    order: {
      id: isValidOrdering(order)
        ? (order.toUpperCase() as "ASC" | "DESC")
        : "DESC",
    },
  };
  const { total, data: questions } = q
    ? await questionServices.search(q, {
        skip: options.skip,
        take: options.take,
      })
    : await questionServices.findAll(options);

  res.json({ total, questions });
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
