import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogController } from "./catalog.controller";
import { Catalog } from "./entity/catalog.entity";
import { Product } from "./entity/product.entity";
import { ProductController } from "./product.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Catalog, Product])],
  controllers: [CatalogController, ProductController],
  providers: [],
})
export class CatalogModule {}
