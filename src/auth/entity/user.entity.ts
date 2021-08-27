import { Expose } from "class-transformer";
import { IsNumber } from "class-validator";
import { Cart } from "src/cart/entity/cart.entity";
import { Seller } from "src/seller/entity/seller.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "../input/user.role";
import { Profile } from "./profile.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @Expose()
  id: number;

  @Column({ unique: true })
  @Expose()
  username: string;

  @Column()
  @Expose()
  password: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  @Expose()
  lastName: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  @Expose()
  profile: Profile;

  @OneToOne(() => Seller, (seller) => seller.user, { cascade: true })
  @Expose()
  seller: Seller;

  @OneToOne(() => Cart, (cart) => cart.user, { nullable: true })
  cart: Cart;

  @Column({ default: Role.CLIENT })
  @Expose()
  role: Role;
}
