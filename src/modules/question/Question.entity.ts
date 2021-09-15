import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export default class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  value?: string;

  @Column()
  picture?: string;

  @Column()
  category?: "LAW" | "SIGNS";

  // TODO: Add relations to answers and correct answers field
  @Column("int", { array: true })
  answers?: number[];

  @Column()
  correctAnswer?: number;
}
