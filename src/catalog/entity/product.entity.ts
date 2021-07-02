import { Seller } from "src/seller/entity/seller.entity.dto";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Catalog } from "./catalog.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @ManyToOne(() => Catalog, (catalog) => catalog.products, { nullable: false })
  @JoinColumn()
  catalog: Catalog;

  @ManyToOne(() => Seller, (seller) => seller.products, { nullable: false })
  @JoinColumn()
  seller: Seller;
}
