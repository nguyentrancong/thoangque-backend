import { Expose } from "class-transformer";
import { User } from "src/auth/entity/user.entity";
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

@Entity()
export class ProductInCart {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  @Expose()
  createDate: string;

  @UpdateDateColumn()
  @Expose()
  updateDate: string;
}
