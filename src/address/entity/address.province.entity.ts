import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn, Unique } from "typeorm";
import { District } from "./address.district.entity";

@Entity()
export class Province {
  @PrimaryColumn()
  @IsString()
  matp: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  slug: string;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];
}
