import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { questionApi } from "./question";
import { answerApi } from "./answers";
import path from "path";
import { globalErrorHanlder, notFound } from "./errorHandlers";

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

app.use("/api/v1/questions", questionApi);
app.use("/api/v1/answers", answerApi);
app.use(globalErrorHanlder);
app.use("*", notFound);

export default app;
