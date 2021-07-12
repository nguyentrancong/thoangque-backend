import { Expose } from "class-transformer";
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
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @ManyToMany(() => Catalog, (catalog) => catalog.sellers)
  @Expose()
  catalogs: Catalog[];

  @Column({ default: false })
  @Expose()
  isActive: boolean;

  @Column({ default: false })
  @Expose()
  isPublish: boolean;

  @Column({ nullable: false })
  @Expose()
  userId: number;

  @OneToMany(() => Product, (product) => product.seller, { cascade: true })
  @Expose()
  products: Product[];

  @CreateDateColumn()
  @Expose()
  createDate: Date;

  @UpdateDateColumn()
  @Expose()
  updateDate: Date;

  @Expose()
  catalogCount?: number;
  @Expose()
  productCount?: number;
}
