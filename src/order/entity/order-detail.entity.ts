import { Expose } from "class-transformer";
import { Product } from "src/catalog/entity/product.entity";
import { BaseEntity } from "src/commons/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderDetail extends BaseEntity {
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
}
