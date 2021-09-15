import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { questionApi } from "./question";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/questions", questionApi);

export default app;
