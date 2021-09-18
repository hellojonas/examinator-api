import Question from "./Question.entity";

export const findAll = async (): Promise<Question[]> => {
  return await Question.find();
};

export const findOne = async (id: number): Promise<Question | null> => {
  const question = await Question.findOne(id);
  return question || null;
};

export const addOne = async (data: Question): Promise<Question | never> => {
  const question = Question.create(data);

  let newQuestion: Question;

  try {
    newQuestion = await question.save();
  } catch (err) {
    // create meaning full error
    console.log(err);
    throw err;
  }

  return newQuestion;
};

export const removeOne = async (id: number): Promise<void | never> => {
  const question = await Question.findOne(id);

  if (!question) {
    throw new Error("Deletion Failed, no user found");
  }

  await question.remove();
};

export const updateOne = async (
  id: number,
  partialData: Question
): Promise<Question | never> => {
  try {
    const question = await Question.findOne(id);

    if (!question) {
      throw new Error("Update Failed, no user found");
    }

    const res = await Question.update(id, partialData);
  } catch (err) {
    console.log(err);
    throw err;
  }

  return Question.create({ ...partialData, id });
};

export const totalQuestions = async () => await Question.count();
