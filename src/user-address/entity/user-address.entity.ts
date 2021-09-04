import { Expose } from "class-transformer";
import { User } from "src/auth/entity/user.entity";
import { BaseEntity } from "src/commons/entity/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

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
  fullName: string; // Tên người nhận

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

  @Column({ default: -1 })
  @Expose()
  defaultAddress: number; // Chọn một địa điểm mặc đinh cho usẻ

  @Column({ default: 0 })
  @Expose()
  typeAddress: number; // Loại địa chỉ: 1. Nhà/chung cư | 2. Cơ quan/Văn phòng
}
