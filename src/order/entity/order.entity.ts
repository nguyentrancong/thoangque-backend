import { Expose } from "class-transformer";
import { IsNumber } from "class-validator";
import { User } from "src/auth/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderStatus } from "../input/status.order";
import { OrderDetail } from "./order-detail.entity";

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

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
    nullable: false,
  })
  @Expose()
  orderDetails: OrderDetail[];

  @Expose()
  total: number;

  @Column({ default: 0 })
  @Expose()
  discount: number;

  @Column({ default: 0 })
  @Expose()
  tax: number;

  @Column({ default: 1 })
  @Expose()
  orderStatus: OrderStatus;

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
