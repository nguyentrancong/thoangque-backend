import { Expose } from "class-transformer";
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
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  image: string;

  @ManyToOne(() => Catalog, (catalog) => catalog.products, { nullable: false })
  @JoinColumn()
  @Expose()
  catalog: Catalog;

  @ManyToOne(() => Seller, (seller) => seller.products, { nullable: false })
  @JoinColumn()
  @Expose()
  seller: Seller;

  @CreateDateColumn()
  @Expose()
  createDate: Date;

  @UpdateDateColumn()
  @Expose()
  updateDate: Date;
}
