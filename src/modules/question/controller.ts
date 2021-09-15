import { Handler } from "express";
import { parseIdParam, tryCatch } from "../utils";
import Question from "./Question.entity";
import * as questionServices from "./services";

export const addQuestion: Handler = tryCatch(async (req, res, next) => {
  // TODO: question creation handler
});

export const allQuestions: Handler = async (req, res) => {
  const { limit, page } = req.query;

  const questions = await questionServices.findAll();
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

export const updateQuestion: Handler = tryCatch(async (req, res, next) => {
  const id = parseIdParam(req.params.id);

  const updatedQuestion = await questionServices.updateOne(
    id,
    req.body as Question
  );

  res.json({ question: updatedQuestion });
});

export const removeQuestion: Handler = tryCatch(async (req, res, next) => {
  const id = parseIdParam(req.params.id);

  await questionServices.removeOne(+id);

  res.status(210).json(null);
});
