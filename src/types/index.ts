// import { Answer } from "../modules/answers";
// import { Category } from "../modules/question";
// import { DeepPartial } from "typeorm";

// export interface IAnswerInput {
export interface IAnswer {
  value: string;
}

export interface IQuestionInput {
  value: string;
  answers: number[];
  // category: Category;
  category: "law" | "signs";
  correctAnswer: number;
  picture: string;
}
