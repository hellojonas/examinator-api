import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "../question";

@Entity()
export default class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;

  @ManyToMany(() => Question)
  @JoinTable()
  questions: Question[];
}
