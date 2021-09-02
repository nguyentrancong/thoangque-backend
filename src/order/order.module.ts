import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogService } from "src/catalog/cataglog.service";
import { Catalog } from "src/catalog/entity/catalog.entity";
import { Product } from "src/catalog/entity/product.entity";
import { ProductService } from "src/catalog/product/product.service";
import { Seller } from "src/seller/entity/seller.entity";
import { SellerService } from "src/seller/seller.services";
import { OrderDetail } from "./entity/order-detail.entity";
import { Order } from "./entity/order.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { OrderDetailService } from "./order-detail/order-detail.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Seller, Product, Catalog]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderDetailService,
    ProductService,
    CatalogService,
    SellerService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
