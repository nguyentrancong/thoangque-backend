import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Catalog } from "src/catalog/entity/catalog.entity";
import { Product } from "src/catalog/entity/product.entity";
import { Seller } from "src/seller/entity/seller.entity.dto";

export default registerAs(
  "orm.config",
  (): TypeOrmModuleOptions => ({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
    entities: [Seller, Catalog, Product],
    synchronize: true,
  })
);
