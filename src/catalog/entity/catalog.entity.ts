import { Expose } from "class-transformer";
import { Seller } from "src/seller/entity/seller.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Catalog {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  image: string;

  @Column({ nullable: true })
  @Expose()
  description: string;

  @Column({ nullable: true })
  @Expose()
  priority: number;

  @OneToMany(() => Product, (product) => product.catalog, { cascade: true })
  @Expose()
  products: Product[];

  @ManyToMany(() => Seller, (seller) => seller.catalogs, { cascade: true })
  @Expose()
  @JoinTable({ name: "sellers_catalogs" })
  sellers: Seller[];

  @CreateDateColumn()
  @Expose()
  createDate: Date;

  @UpdateDateColumn()
  @Expose()
  updateDate: Date;

  @Expose()
  productCount?: number;
  @Expose()
  sellerCount?: number;
}
