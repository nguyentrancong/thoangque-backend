import { Expose } from "class-transformer";
import { User } from "src/auth/entity/user.entity";
import { Catalog } from "src/catalog/entity/catalog.entity";
import { Product } from "src/catalog/entity/product.entity";
import { BaseEntity } from "src/commons/entity/base.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm";

@Entity()
export class Seller extends BaseEntity {
  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  address: string;

  @ManyToMany(() => Catalog, (catalog) => catalog.sellers)
  @Expose()
  catalogs: Catalog[];

  @Column({ default: false })
  @Expose()
  isActive: boolean;

  @Column({ default: false })
  @Expose()
  isPublished: boolean;

  @OneToOne(() => User, (user) => user.seller)
  @Expose()
  @JoinColumn()
  user: User;

  @OneToMany(() => Product, (product) => product.seller)
  @Expose()
  products: Product[];

  @Expose()
  catalogCount?: number;
  @Expose()
  productCount?: number;
}
