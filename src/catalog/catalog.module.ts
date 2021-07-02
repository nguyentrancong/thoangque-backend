import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Seller } from "src/seller/entity/seller.entity.dto";
import { CatalogService } from "./cataglog.service";
import { CatalogController } from "./catalog.controller";
import { Catalog } from "./entity/catalog.entity";
import { Product } from "./entity/product.entity";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [TypeOrmModule.forFeature([Catalog, Product, Seller])],
  controllers: [CatalogController, ProductController],
  providers: [CatalogService, ProductService],
})
export class CatalogModule {}
