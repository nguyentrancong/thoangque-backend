import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatalogModule } from "./catalog/catalog.module";
import { SellerModule } from "./seller/seller.module";
import { AuthModule } from "./auth/auth.module";
import { AddressModule } from "./address/address.module";
import { AddressUserModule } from "./address-user/address-user.module";
import { ShippingFeeModule } from "./shipping-fee/shipping-fee.module";
import { CartModule } from "./cart/cart.module";
import { OrderModule } from "./order/order.module";
import ormConfig from "./config/orm.config";
import ormConfigProd from "./config/orm.config.prod";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== "production" ? ormConfig : ormConfigProd,
    }),
    CatalogModule,
    SellerModule,
    AuthModule,
    AddressModule,
    AddressUserModule,
    ShippingFeeModule,
    CartModule,
    OrderModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
