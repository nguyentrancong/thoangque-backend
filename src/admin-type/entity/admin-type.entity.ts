import { Expose } from "class-transformer";
import { BaseEntity } from "src/commons/entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class AdminType extends BaseEntity {
  @Column()
  @Expose()
  adminType: string;

  @Column()
  @Expose()
  permission: string;
}
