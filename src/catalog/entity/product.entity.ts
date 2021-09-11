import { Expose } from "class-transformer";
import { ProductInCart } from "src/cart/entity/productInCart.entity";
import { BaseEntity } from "src/commons/entity/base.entity";
import { OrderDetail } from "src/order/entity/order-detail.entity";
import { Seller } from "src/seller/entity/seller.entity";
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
import { Catalog } from "./catalog.entity";

@Entity()
export class Product extends BaseEntity {
  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  image: string;

  @ManyToOne(() => Catalog, (catalog) => catalog.products, { nullable: false })
  @JoinColumn()
  @Expose()
  catalog: Catalog;

  @ManyToOne(() => Seller, (seller) => seller.products, { nullable: false })
  @JoinColumn()
  @Expose()
  seller: Seller;

  //product in cart
  @OneToMany(() => ProductInCart, (productInCart) => productInCart.product)
  @Expose()
  productsInCart: ProductInCart[];

  //product in order detail
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  @Expose()
  orderDetails: OrderDetail[];
}
