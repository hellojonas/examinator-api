import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  filename: string;
}
