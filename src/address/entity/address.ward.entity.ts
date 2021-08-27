import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { District } from "./address.district.entity";

@Entity()
export class Ward {
  @PrimaryColumn()
  @IsString()
  xaid: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToOne(() => District, (district) => district.wards)
  @JoinColumn({ name: "maqh" })
  district: District;
}
