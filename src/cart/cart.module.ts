import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogService } from "src/catalog/cataglog.service";
import { Catalog } from "src/catalog/entity/catalog.entity";
import { Product } from "src/catalog/entity/product.entity";
import { ProductService } from "src/catalog/product/product.service";
import { Seller } from "src/seller/entity/seller.entity";
import { SellerService } from "src/seller/seller.services";
import { ProductInCart } from "./entity/productInCart.entity";
import { ProductInCartController } from "./productInCart.controller";
import { ProductInCartService } from "./productInCart.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductInCart, Product, Seller, Catalog]),
  ],
  controllers: [ProductInCartController],
  providers: [
    ProductInCartService,
    ProductService,
    SellerService,
    CatalogService,
  ],
  exports: [],
})
export class CartModule {}
