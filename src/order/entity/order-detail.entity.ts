import { Expose } from "class-transformer";
import { IsNumber } from "class-validator";
import { Product } from "src/catalog/entity/product.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @Expose()
  id: string;

  @Column({ default: 0 })
  @Expose()
  price: number;

  @Column({ default: 0 })
  @Expose()
  quantity: number;

  @Column({ default: 0 })
  @Expose()
  discount: number;

  @ManyToOne(() => Product, (product) => product.orderDetails, {
    nullable: false,
  })
  @JoinColumn()
  @Expose()
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderDetails, { nullable: false })
  @Expose()
  @JoinColumn()
  order: Order;

  @Expose()
  total: number;

  @CreateDateColumn()
  @Expose()
  createDate: string;

  @UpdateDateColumn()
  @Expose()
  updateDate: string;
}
