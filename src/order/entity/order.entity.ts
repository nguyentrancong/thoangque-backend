import { Expose } from "class-transformer";
import { IsNumber } from "class-validator";
import { User } from "src/auth/entity/user.entity";
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  @Expose()
  @IsNumber()
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { cascade: true })
  @JoinColumn()
  @Expose()
  user: User;

  @CreateDateColumn()
  @Expose()
  createDate: string;

  @UpdateDateColumn()
  @Expose()
  updateDate: string;
}
