import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { District } from "./address.district.entity";

@Entity()
export class Ward {
  @PrimaryColumn()
  @IsString()
  @Expose()
  xaid: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  type: string;

  @ManyToOne(() => District, (district) => district.wards)
  @JoinColumn({ name: "maqh" })
  @Expose()
  district: District;
}
