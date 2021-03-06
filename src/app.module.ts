import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatalogModule } from "./catalog/catalog.module";
import { SellerModule } from "./seller/seller.module";
import { AuthModule } from "./auth/auth.module";
import { AddressModule } from "./address/address.module";
import { UserAddressModule } from "./user-address/user-address.module";
import { ShippingFeeModule } from "./shipping-fee/shipping-fee.module";
import { CartModule } from "./cart/cart.module";
import { OrderModule } from "./order/order.module";
import { ProductInventoryModule } from './product-inventory/product-inventory.module';
import { DiscountModule } from './discount/discount.module';
import { UserPaymentModule } from './user-payment/user-payment.module';
import { AdminTypeModule } from './admin-type/admin-type.module';
import { AdminUserModule } from './admin-user/admin-user.module';
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
    UserAddressModule,
    ShippingFeeModule,
    CartModule,
    OrderModule,
    ProductInventoryModule,
    DiscountModule,
    UserPaymentModule,
    AdminTypeModule,
    AdminUserModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
