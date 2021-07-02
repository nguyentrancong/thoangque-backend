import { Catalog } from "src/catalog/entity/catalog.entity";
import { Product } from "src/catalog/entity/product.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  catalogCount?: number;
  productCount?: number;
}
