import { Expose } from "class-transformer";
import { IsNumber } from "class-validator";
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @Expose()
  id: number;

  @CreateDateColumn()
  @Expose()
  createDate: string;

  @UpdateDateColumn()
  @Expose()
  updateDate: string;

  @Column({ default: -1 })
  @Expose()
  priority: number;
}
