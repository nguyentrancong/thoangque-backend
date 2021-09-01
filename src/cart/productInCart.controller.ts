import {
  ClassSerializerInterceptor,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  SerializeOptions,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/entity/user.entity";
import { PaginateOptions } from "src/pagination/paginator";
import { CreateProductInCartDto } from "./input/create-productInCart.dto";
import { ListProductInCart } from "./input/list.productInCart";
import { UpdateProductInCartDto } from "./input/update-productInCart.dto";
import { ProductInCartService } from "./productInCart.service";

@ApiTags("ProductInCart - Cart online")
@Controller("ProductInCart")
@SerializeOptions({ strategy: "excludeAll" })
export class ProductInCartController {
  private readonly logger = new Logger(ProductInCartController.name);
  constructor(private readonly productInCartService: ProductInCartService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async find(@Query() filter: ListProductInCart, @CurrentUser() user: User) {
    const paginations: PaginateOptions = {
      currentPage: filter.page,
      limit: filter.limit,
      total: true,
    };

    const result =
      await this.productInCartService.getProductsInCartWithPaginations(
        user,
        filter,
        paginations
      );
    return result;
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    const result = await this.productInCartService.getProductInCart(id, user);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async create(
    @Body() input: CreateProductInCartDto,
    @CurrentUser() user: User
  ) {
    return await this.productInCartService.createProductInCart(input, user);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() input: UpdateProductInCartDto,
    @CurrentUser() user: User
  ) {
    return await this.productInCartService.updateProductInCart(id, input, user);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  async delete(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return await this.productInCartService.deleteProductInCart(id, user);
  }

  @Delete("/deleteAll/:userId")
  @ApiBearerAuth()
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  async deleteProductsInCart(
    @Param("userId", ParseIntPipe) userId: number,
    @CurrentUser() user: User
  ) {
    return await this.productInCartService.deleteProductsInCart(user);
  }
}
