import {
  ClassSerializerInterceptor,
  Get,
  Logger,
  Post,
  SerializeOptions,
  UseInterceptors,
} from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuardJwt } from "./auth-guard.jwt";
import { AuthGuardLocal } from "./auth-guard.local";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./current-user.decorator";
import { User } from "./entity/user.entity";

@ApiTags("Auth")
@Controller("/auth")
@SerializeOptions({ strategy: "excludeAll" })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    this.logger.log(`${this.login.name}: ${user}`);
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get("profile")
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  async getProfile(@CurrentUser() user: User) {
    this.logger.log(`${this.getProfile.name}: ${user}`);
    return user;
  }
}
