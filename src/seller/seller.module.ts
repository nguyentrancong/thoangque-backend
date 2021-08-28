import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/auth/entity/user.entity";
import { Catalog } from "src/catalog/entity/catalog.entity";
import { Product } from "src/catalog/entity/product.entity";
import { Seller } from "./entity/seller.entity";
import { SellerController } from "./seller.controller";
import { SellerService } from "./seller.services";

@Module({
  imports: [TypeOrmModule.forFeature([Seller, Catalog, Product, User])],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
})
export class SellerModule {}
