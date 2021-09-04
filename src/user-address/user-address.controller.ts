import {
  Body,
  ClassSerializerInterceptor,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { PaginateOptions } from "src/pagination/paginator";
import { CreateUserAddressDto } from "./input/create-user-address.dto";
import { ListUserAddress } from "./input/list.user-address";
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
  async find(@CurrentUser() user: User, @Query() filter: ListUserAddress) {
    const paginateOptions: PaginateOptions = {
      currentPage: filter.page,
      limit: filter.limit,
      total: true,
    };
    return await this.userAddressService.getUserAddressAndMapWithFilterPaginatons(
      user,
      filter,
      paginateOptions
    );
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number
  ) {
    const userAddress = await this.userAddressService.getUserAddress(user, id);
    if (!userAddress) {
      throw new NotFoundException([`Get | Not found id : ${id}`]);
    }
    return userAddress;
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async create(@CurrentUser() user: User, @Body() input: CreateUserAddressDto) {
    return await this.userAddressService.createUserAddress(user, input);
  }

  @Patch("/update/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async update(
    @CurrentUser() user: User,
    @Body() input: UpdateUserAddressDto,
    @Param("id", ParseIntPipe) id: number
  ) {
    return await this.userAddressService.updateUserAddress(user, input, id);
  }

  @Delete("/delete/:id")
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async delete(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number
  ) {
    return await this.userAddressService.deleteUserAddress(user, id);
  }
}
