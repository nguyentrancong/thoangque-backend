import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { DistrictService } from "./district.service";
import { District } from "./entity/address.district.entity";
import { Province } from "./entity/address.province.entity";
import { Ward } from "./entity/address.ward.entity";
import { ProvinceService } from "./province.service";
import { WardService } from "./ward.service";

@Module({
  imports: [TypeOrmModule.forFeature([District, Ward, Province])],
  controllers: [AddressController],
  providers: [AddressService, ProvinceService, DistrictService, WardService],
})
export class AddressModule {}
