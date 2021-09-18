import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  value: string;
}
