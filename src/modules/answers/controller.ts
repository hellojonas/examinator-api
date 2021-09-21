import { IAnswer } from "src/types";
import { isValidOrdering, paginate, tryCatch } from "../utils";
import Answer from "./Answer.entity";
import * as answerServices from "./services";
import { parseIdParam } from "../utils";
import { DeepPartial } from "typeorm";

export const addAnswer = tryCatch(async (req, res) => {
  const { value } = <IAnswer>req.body;
  const answer = await answerServices.addAnswer({ value });

  res.status(201).json({ answer });
});

export const deleteAnswer = tryCatch(async (req, res) => {
  const id = parseIdParam(req.params.id);
  await answerServices.deleteOne(id);

  res.status(204).json(null);
});

export const getAnswer = tryCatch(async (req, res) => {
  const id = parseIdParam(req.params.id);
  const answer = await answerServices.getOne(id);

  res.json({ answer });
});

export const getAll = tryCatch(async (req, res) => {
  const { limit, skip, order } = req.query as {
    limit: string;
    skip: string;
    order: string;
  };
  const range = paginate({ limit, skip });
  const answers = await answerServices.getAll({
    skip: range.skip,
    take: range.limit,
    order: {
      id: isValidOrdering(order)
        ? (order.toUpperCase() as "ASC" | "DESC")
        : "DESC",
    },
  });
  const total = await answerServices.count();

  res.json({ total, answers });
});

export const updateAnswer = tryCatch(async (req, res) => {
  const id = parseIdParam(req.params.id);
  const data = req.body as DeepPartial<Answer>;

  data.id = undefined;

  const updatedAnswer = await answerServices.update(id, data);

  res.status(updatedAnswer ? 200 : 304).json({ answer: updatedAnswer });
});
