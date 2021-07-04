import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Profile } from "./entity/profile.entity";
import { User } from "./entity/user.entity";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";
import { UserController } from "./user.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: "60m",
        },
      }),
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [LocalStrategy, AuthService, JwtStrategy],
})
export class AuthModule {}
