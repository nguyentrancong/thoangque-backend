import { Get, Logger, Post } from "@nestjs/common";
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
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    this.logger.log(`Login: ${user}`);
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get("profile")
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  async getProfile(@CurrentUser() user: User) {
    this.logger.log(`Get profile: ${user}`);
    return user;
  }
}
