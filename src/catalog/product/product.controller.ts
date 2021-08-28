import {
  Body,
  ClassSerializerInterceptor,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Get, ParseIntPipe } from "@nestjs/common";
import { Controller, Delete } from "@nestjs/common";
import { CreateProductDto } from "../input/create-product.dto";
import { UpdateProductDto } from "../input/update-product.dto";
import { Patch } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginateOptions } from "src/pagination/paginator";
import { ListProduct } from "../input/list.product";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/entity/user.entity";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";

@ApiTags("Product")
@Controller("/product")
@SerializeOptions({ strategy: "excludeAll" })
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) {}

  @Get("/products")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListProduct) {
    const paginations: PaginateOptions = {
      currentPage: filter.page,
      limit: filter.limit,
      total: true,
    };

    const products =
      await this.productService.getProductsAndMapFilterPaginations(
        filter,
        paginations
      );

    if (!products) {
      throw new NotFoundException();
    }
    return products;
  }

  @Get(":id")
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const product = await this.productService.getProduct(id);

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  @Post(":sellerId/:catalogId")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async create(
    @Param("sellerId", ParseIntPipe) sellerId: number,
    @Param("catalogId", ParseIntPipe) catalogId: number,
    @Body() input: CreateProductDto,
    @CurrentUser() user: User
  ) {
    return await this.productService.createProduct(
      sellerId,
      catalogId,
      input,
      user
    );
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async updater(
    @Param("id", ParseIntPipe) id: number,
    @Body() input: UpdateProductDto,
    @CurrentUser() user: User
  ) {
    return await this.productService.updateProduct(id, input, user);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return await this.productService.deleteProduct(id, user);
  }
}
