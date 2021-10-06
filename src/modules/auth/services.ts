import { getRepository } from "typeorm";
import * as yup from "yup";
import { AppError, ErrorCode } from "../utils/errors";
import User from "./User.entity";
import { hash, compare } from "bcryptjs";
import { IUserInput } from "src/types";
import jwt from "jsonwebtoken";

export async function login(
  loginData: { email: string; password: string },
  jwtSecret: string
) {
  const validator = yup.object().shape({
    email: yup
      .string()
      .email("email is not valid")
      .required("email is required"),
    password: yup
      .string()
      .required("password is required")
      .min(8, "passwor must be at least 8 chars long"),
  });

  try {
    const data = await validator.validate(loginData);
    const user = await getRepository(User).findOne({
      where: { email: data.email },
    });

    const err = new AppError(
      ErrorCode.RECORD_NOT_FOUND,
      "Email or password are invalid"
    );

    if (!user) {
      throw err;
    }

    const match = await compare(data.password, user.password);

    if (!user || !match) {
      throw err;
    }

    return {
      id: user.id,
      token: jwt.sign({ id: user.id }, jwtSecret),
    };
  } catch (error) {
    throw error;
  }
}

export async function signup(signupData: IUserInput, jwtSecret: string) {
  const validator = yup.object().shape({
    name: yup.string().notRequired().min(3),
    email: yup
      .string()
      .email("email is not valid")
      .required("email is required"),
    password: yup
      .string()
      .required("password is required")
      .min(8, "passwor must be at least 8 chars long"),
  });

  try {
    const repository = getRepository(User);
    const data = await validator.validate(signupData);
    const hashedPass = await hash(data.password, 12);
    const userData = repository.create({ ...data, password: hashedPass });
    const newUser = await repository.save(userData);

    const token = jwt.sign({ id: newUser.id }, jwtSecret);

    return { ...newUser, token, password: undefined };
  } catch (error) {
    throw error;
  }
}
