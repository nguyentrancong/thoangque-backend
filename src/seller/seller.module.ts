import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Catalog } from "src/catalog/entity/catalog.entity";
import { Product } from "src/catalog/entity/product.entity";
import { Seller } from "./entity/seller.entity.dto";
import { SellerController } from "./seller.controller";
import { SellerService } from "./seller.services";

@Module({
  imports: [TypeOrmModule.forFeature([Seller, Catalog, Product])],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
