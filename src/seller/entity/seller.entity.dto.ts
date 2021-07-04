import { User } from "src/auth/entity/user.entity";
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

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isPublish: boolean;

  @Column({ nullable: false })
  userId: number;

  @OneToMany(() => Product, (product) => product.seller, { cascade: true })
  products: Product[];

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  catalogCount?: number;
  productCount?: number;
}
