import { Catalog } from "src/catalog/entity/catalog.entity";
import { Product } from "src/catalog/entity/product.entity";
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => Catalog, (catalog) => catalog.sellers)
  catalogs: Catalog[];

  @OneToMany(() => Product, (product) => product.seller, { cascade: true })
  products: Product[];

  catalogCount?: number;
  productCount?: number;
}
