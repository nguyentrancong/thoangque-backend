import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Province } from "./address.province.entity";
import { Ward } from "./address.ward.entity";

@Entity()
export class District {
  @PrimaryColumn()
  @IsString()
  @Expose()
  maqh: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  type: string;

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: "matp" })
  @Expose()
  province: Province;

  @OneToMany(() => Ward, (ward) => ward.district)
  @Expose()
  wards: Ward[];
}
