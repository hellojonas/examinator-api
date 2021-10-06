import { Handler } from "express";
import { tryCatch } from "../utils";
import * as services from "./services";

export const login: Handler = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  const loginInfo = await services.login(
    { email, password },
    process.env.JWT_SECRET as string
  );

  res.json(loginInfo);
});

export const signup: Handler = tryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  const signupData = await services.signup(
    { email, name, password },
    process.env.JWT_SECRET as string
  );

  res.json(signupData);
});

export const isAuth: Handler = tryCatch(async (req, res, next) => {
  if (!req?.user) {
    res.status(401).json({ message: "Not Logged In" });
    return;
  }

  next();
});
