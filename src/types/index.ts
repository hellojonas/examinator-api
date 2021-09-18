import { Answer } from "src/modules/answers";
import { DeepPartial } from "typeorm";

export interface IAnswer extends DeepPartial<Answer> {
  value: string;
}
