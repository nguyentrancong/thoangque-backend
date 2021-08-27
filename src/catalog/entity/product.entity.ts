import { Seller } from "src/seller/entity/seller.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
