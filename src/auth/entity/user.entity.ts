import { Expose } from "class-transformer";
import { ProductInCart } from "src/cart/entity/productInCart.entity";
import { BaseEntity } from "src/commons/entity/base.entity";
import { Order } from "src/order/entity/order.entity";
import { Seller } from "src/seller/entity/seller.entity";
import { UserAddress } from "src/user-address/entity/user-address.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { Role } from "../input/user.role";
import { Profile } from "./profile.entity";

@Entity()
export class User extends BaseEntity {
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

  @OneToMany(() => ProductInCart, (productInCart) => productInCart.user)
  @Expose()
  productsInCart: ProductInCart[];

  @OneToMany(() => Order, (order) => order.user)
  @Expose()
  orders: Order[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.user)
  @Expose()
  address: UserAddress[];

  @Column({ default: Role.CLIENT })
  @Expose()
  role: Role;
}
