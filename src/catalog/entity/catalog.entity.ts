import { Seller } from "src/seller/entity/seller.entity.dto";
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
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  priority: number;

  @OneToMany(() => Product, (product) => product.catalog, { cascade: true })
  products: Product[];

  @ManyToMany(() => Seller, (seller) => seller.catalogs, { cascade: true })
  @JoinTable()
  sellers: Seller[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  productCount?: number;
  sellerCount?: number;
}
