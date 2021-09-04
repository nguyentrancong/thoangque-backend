import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { District } from "src/address/entity/address.district.entity";
import { Province } from "src/address/entity/address.province.entity";
import { Ward } from "src/address/entity/address.ward.entity";
import { ProvinceService } from "src/address/province.service";
import { UserAddress } from "./entity/user-address.entity";
import { UserAddressController } from "./user-address.controller";
import { UserAddressService } from "./user-address.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress, Province, District, Ward])],
  controllers: [UserAddressController],
  providers: [UserAddressService, ProvinceService],
  exports: [UserAddressService],
})
export class UserAddressModule {}
