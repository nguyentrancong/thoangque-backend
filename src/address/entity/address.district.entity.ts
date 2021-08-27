import { ApiProperty } from "@nestjs/swagger";
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
  maqh: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: "matp" })
  province: Province;

  @OneToMany(() => Ward, (ward) => ward.district)
  wards: Ward[];
}
