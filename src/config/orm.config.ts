import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { District } from "src/address/entity/address.district.entity";
import { Province } from "src/address/entity/address.province.entity";
import { Ward } from "src/address/entity/address.ward.entity";
import { Profile } from "src/auth/entity/profile.entity";
import { User } from "src/auth/entity/user.entity";
import { ProductInCart } from "src/cart/entity/productInCart.entity";
import { Catalog } from "src/catalog/entity/catalog.entity";
import { Product } from "src/catalog/entity/product.entity";
import { OrderDetail } from "src/order/entity/order-detail.entity";
import { Order } from "src/order/entity/order.entity";
import { Seller } from "src/seller/entity/seller.entity";

export default registerAs(
  "orm.config",
  (): TypeOrmModuleOptions => ({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
    entities: [
      Seller,
      Catalog,
      Product,
      User,
      Profile,
      District,
      Ward,
      Province,
      ProductInCart,
      Order,
      OrderDetail,
    ],
    synchronize: true,
  })
);
