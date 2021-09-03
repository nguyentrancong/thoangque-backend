import { Expose } from "class-transformer";
import { IsNumber } from "class-validator";
import { User } from "src/auth/entity/user.entity";
import { BaseEntity } from "src/commons/entity/base.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class UserAddress extends BaseEntity {
  @ManyToOne(() => User, (user) => user.address, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  @Expose()
  user: User;

  @Column()
  @Expose()
  fullName: string;

  @Column({ nullable: false })
  @Expose()
  addressLine: string;

  @Column()
  @Expose()
  province: string;

  @Column()
  @Expose()
  district: string;

  @Column()
  @Expose()
  ward: string;

  @Column()
  @Expose()
  phone: string;

  @Column({ default: 0 })
  @Expose()
  defaultAddress: number;

  @Column({ default: 0 })
  @Expose()
  typeAddress: number;
}
