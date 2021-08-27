import { Expose } from "class-transformer";
import { User } from "src/auth/entity/user.entity";
import { Catalog } from "src/catalog/entity/catalog.entity";
import { Product } from "src/catalog/entity/product.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
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
