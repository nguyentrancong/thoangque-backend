import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
  when: Date;

  @Column({ nullable: true })
  priority: number;

  @OneToMany(() => Product, (product) => product.catalog, { cascade: true })
  products: Product[];
}
