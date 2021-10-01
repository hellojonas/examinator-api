import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Answer } from "../answers";

export enum Category {
  LAW = "law",
  SIGNS = "signs",
}

@Entity()
export default class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;

  @Column({ type: "enum", enum: Category, default: Category.SIGNS })
  category: Category;

  @ManyToMany(() => Answer, { eager: true, nullable: false })
  @JoinTable()
  answers: Answer[];

  @ManyToOne(() => Answer, (question) => question.questions, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  correctAnswer: Answer;

  @Column({ nullable: true })
  picture: string;
}
