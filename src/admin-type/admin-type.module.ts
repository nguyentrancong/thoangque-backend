import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminType } from "./entity/admin-type.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AdminType])],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminTypeModule {}
