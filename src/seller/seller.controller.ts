import {
  Body,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Query } from "@nestjs/common";
import {
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/entity/user.entity";
import { CreateSellerDto } from "./input/create-seller.dto";
import { ListSellers } from "./input/list.seller";
import { UpdateSellerDto } from "./input/update-seller.dto";
import { SellerService } from "./seller.services";

@ApiTags("Seller")
@Controller("/seller")
@SerializeOptions({ strategy: "excludeAll" })
export class SellerController {
  private readonly logger = new Logger(SellerController.name);
  constructor(private readonly sellerService: SellerService) {}

  @Get("/sellers")
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListSellers) {
    const sellers =
      await this.sellerService.getSellerWithCountAndMapFilterPaginated(filter, {
        total: true,
        limit: filter.limit,
        currentPage: filter.page,
      });

    return sellers;
  }

  @Get(":id")
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const seller = await this.sellerService.getSeller(id);
    if (!seller) {
      throw new NotFoundException();
    }
    return seller;
  }

  @Post("/create")
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  async create(@Body() input: CreateSellerDto, @CurrentUser() user: User) {
    return await this.sellerService.createSeller(input, user);
  }

  @Patch("/update")
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  async update(@Body() input: UpdateSellerDto, @CurrentUser() user: User) {
    return await this.sellerService.updateSeller(input, user);
  }

  @Delete("/delete")
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  async remove(@CurrentUser() user: User) {
    await this.sellerService.deleteSeller(user);
  }
}
