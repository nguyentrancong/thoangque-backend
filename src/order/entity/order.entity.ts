import { Expose } from "class-transformer";
import { IsNumber } from "class-validator";
import { User } from "src/auth/entity/user.entity";
import {
  Column,
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

  @ManyToOne(() => User, (user) => user.orders, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  @Expose()
  user: User;

  @Column({ default: 0 })
  @Expose()
  total: number;

  @Column({ default: 0 })
  @Expose()
  discount: number;

  @Column({ default: 0 })
  @Expose()
  tax: number;

  @Column({ default: 0 })
  @Expose()
  status: number;

  @Column({ default: 0 })
  @Expose()
  shippingFee: number;

  @CreateDateColumn()
  @Expose()
  createDate: string;

  @UpdateDateColumn()
  @Expose()
  updateDate: string;
}
