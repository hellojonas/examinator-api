export interface IAnswer {
  value: string;
}

export interface IQuestionInput {
  value: string;
  answers: number[];
  category: "law" | "signs";
  correctAnswer: number;
  picture: string;
}

export interface FindManyResult<T> {
  data: T[];
  total: number;
}

export interface IUploadInput {
  filename: string;
}

export type MulterFile = Express.Multer.File;
