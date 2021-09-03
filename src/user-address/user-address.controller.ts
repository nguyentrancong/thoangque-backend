import {
  Body,
  ClassSerializerInterceptor,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Controller, Logger } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/entity/user.entity";
import { CreateUserAddressDto } from "./input/create-user-address.dto";
import { UpdateUserAddressDto } from "./input/update-user-address.dto";
import { UserAddressService } from "./user-address.service";

@ApiTags("User Address")
@Controller("/userAddress")
@SerializeOptions({ strategy: "excludeAll" })
export class UserAddressController {
  private readonly logger = new Logger(UserAddressController.name);
  constructor(private readonly userAddressService: UserAddressService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async find(@CurrentUser() user: User) {
    return "find all address";
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @CurrentUser() user: User,
    @Param(":id", ParseIntPipe) id: number
  ) {
    return "find one address";
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async create(@CurrentUser() user: User, @Body() input: CreateUserAddressDto) {
    return "create address";
  }

  @Patch("/update/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async update(
    @CurrentUser() user: User,
    @Body() input: UpdateUserAddressDto,
    @Param("id", ParseIntPipe) id: number
  ) {
    return "update address";
  }

  @Delete("/delete/:id")
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async delete(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number
  ) {
    return "delete address";
  }
}
