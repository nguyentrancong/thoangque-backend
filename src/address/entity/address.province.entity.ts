import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryColumn, Unique } from "typeorm";
import { District } from "./address.district.entity";

@Entity()
export class Province {
  @PrimaryColumn()
  @IsString()
  @Expose()
  matp: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  type: string;

  @Column()
  @Expose()
  slug: string;

  @OneToMany(() => District, (district) => district.province)
  @Expose()
  districts: District[];
}
