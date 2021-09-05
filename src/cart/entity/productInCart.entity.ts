import { Expose } from "class-transformer";
import { User } from "src/auth/entity/user.entity";
import { Product } from "src/catalog/entity/product.entity";
import { BaseEntity } from "src/commons/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class ProductInCart extends BaseEntity {
  @ManyToOne(() => User, (user) => user.productsInCart, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn()
  @Expose()
  user: User;

  @ManyToOne(() => Product, (product) => product.productsInCart, {
    nullable: false,
  })
  @JoinColumn()
  @Expose()
  product: Product;

  @Column({ default: 0 })
  @Expose()
  quantity: number;
}
