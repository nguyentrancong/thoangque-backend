import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatalogModule } from "./catalog/catalog.module";
import { Catalog } from "./catalog/entity/catalog.entity";
import { SellerModule } from './seller/seller.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
