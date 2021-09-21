import * as yup from "yup";

export const questionInputSchema = yup.object().shape({
  value: yup.string().required(),
  picture: yup.string().required(),
  correctAnswer: yup.number().required(),
  category: yup.string().required().oneOf(["signs", "law"]),
  answers: yup
    .array(yup.number())
    .min(2)
    .required("Question must have at least two options"),
});

export const questionUpdateSchema = yup.object().shape({
  value: yup.string().notRequired().nullable().min(1),
  picture: yup.string().notRequired().nullable().min(1),
  correctAnswer: yup.number().notRequired().nullable().min(1),
  category: yup.string().notRequired().oneOf(["signs", "law"]),
  answers: yup.array(yup.number()).notRequired().nullable().min(2),
});
