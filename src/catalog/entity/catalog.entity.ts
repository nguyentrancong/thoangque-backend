import { Expose } from "class-transformer";
import { Seller } from "src/seller/entity/seller.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { Product } from "./product.entity";
import { BaseEntity } from "./../../commons/entity/base.entity";

@Entity()
export class Catalog extends BaseEntity {
  @Column()
  @Expose()
  name: string;

  @Column({ default: 0 })
  @Expose()
  price: number;

  @Column()
  @Expose()
  image: string;

  @Column({ nullable: true })
  @Expose()
  description: string;

  @OneToMany(() => Product, (product) => product.catalog, { cascade: true })
  @Expose()
  products: Product[];

  @ManyToMany(() => Seller, (seller) => seller.catalogs, { cascade: true })
  @Expose()
  @JoinTable({ name: "sellers_catalogs" })
  sellers: Seller[];

  @Expose()
  productCount?: number;
  @Expose()
  sellerCount?: number;
}
