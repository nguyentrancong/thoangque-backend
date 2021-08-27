import { Expose } from "class-transformer";
import { User } from "src/auth/entity/user.entity";
import { Product } from "src/catalog/entity/product.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Product, (product) => product.cart, { nullable: true })
  @Expose()
  @JoinColumn()
  products: ProductsList[];

  @CreateDateColumn()
  @Expose()
  createDate: string;

  @UpdateDateColumn()
  @Expose()
  updateDate: string;
}

export interface ProductsList {
  product: Product;
  quantity: number;
}
