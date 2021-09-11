import { Expose } from "class-transformer";
import { User } from "src/auth/entity/user.entity";
import { BaseEntity } from "src/commons/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { OrderStatus } from "../input/status.order";
import { OrderDetail } from "./order-detail.entity";

@Entity()
export class Order extends BaseEntity {
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
}
