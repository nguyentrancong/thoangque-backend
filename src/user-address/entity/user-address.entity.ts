import { Expose } from "class-transformer";
import { IsNumber } from "class-validator";
import { User } from "src/auth/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class UserAddress {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @Expose()
  id: number;

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
  city: string;

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

  @CreateDateColumn()
  @Expose()
  createDate: string;

  @UpdateDateColumn()
  @Expose()
  updateDate: string;
}
