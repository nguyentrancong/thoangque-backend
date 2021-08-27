import {
  ClassSerializerInterceptor,
  Logger,
  ParseIntPipe,
  Patch,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Controller,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/entity/user.entity";
import { PaginateOptions } from "src/pagination/paginator";
import { CatalogService } from "./cataglog.service";
import { CreateCatalogDto } from "./input/create-catalog.dto";
import { ListCatalog } from "./input/list.catalog";
import { UpdateCatalogDto } from "./input/update-catalog.dto";

@ApiTags("Catalog")
@Controller("/catalog")
@SerializeOptions({ strategy: "excludeAll" })
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListCatalog) {
    const paginations: PaginateOptions = {
      currentPage: filter.page,
      limit: filter.limit,
      total: true,
    };
    const catalogs =
      await this.catalogService.getCatalogWithCountAndMapFilterPaginated(
        filter,
        paginations
      );
    return catalogs;
  }

  @Get(":id")
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const catalog = await this.catalogService.getCatalog(id);
    if (!catalog) {
      throw new NotFoundException();
    }
    this.logger.log(`findOne : ${catalog}`);
    return catalog;
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async create(@Body() input: CreateCatalogDto, @CurrentUser() user: User) {
    return await this.catalogService.createCatalog(input, user);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() input: UpdateCatalogDto,
    @CurrentUser() user: User
  ) {
    return await this.catalogService.updateCatalog(id, input, user);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    await this.catalogService.deleteCatalog(id, user);
  }
}
