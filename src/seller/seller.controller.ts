import {
  BadRequestException,
  Body,
  UseGuards,
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
import { ApiTags } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/entity/user.entity";
import { Repository } from "typeorm";
import { Seller } from "./entity/seller.entity.dto";
import { CreateSellerDto } from "./input/create-seller.dto";
import { ListSellers } from "./input/list.seller";
import { UpdateSellerDto } from "./input/update-seller.dto";
import { SellerService } from "./seller.services";

@ApiTags("Seller")
@Controller("/seller")
export class SellerController {
  private readonly logger = new Logger(SellerController.name);
  constructor(
    private readonly sellerService: SellerService,

    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
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
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const seller = await this.sellerService.getSeller(id);
    if (!seller) {
      throw new NotFoundException();
    }
    return seller;
  }

  @Post("/create")
  @UseGuards(AuthGuardJwt)
  async create(@Body() input: CreateSellerDto, @CurrentUser() user: User) {
    return await this.sellerService.createSeller(input, user);
  }

  @Patch("/update")
  @UseGuards(AuthGuardJwt)
  async update(@Body() input: UpdateSellerDto, @CurrentUser() user: User) {
    const userSeller = await this.userRepository.findOne(user.id, {
      relations: ["seller"],
    });
    const seller = userSeller.seller;

    if (!seller) {
      throw new NotFoundException();
    }

    if (seller?.userId !== user.id) {
      throw new NotFoundException(
        null,
        `You are not authorized to change this seller`
      );
    }
    return await this.sellerRepository.save({
      ...seller,
      ...input,
      userId: seller.userId,
    });
  }

  @Delete("/delete")
  @UseGuards(AuthGuardJwt)
  async remove(@CurrentUser() user: User) {
    const userSeller = await this.userRepository.findOne(user.id, {
      relations: ["seller"],
    });
    const seller = userSeller.seller;

    if (!seller) {
      throw new NotFoundException();
    }
    if (seller?.userId !== user.id) {
      throw new NotFoundException(
        null,
        `You are not authorized to remove this seller`
      );
    }
    await this.userRepository.save({ ...user, seller: null });
    await this.sellerService.deleteSeller(seller.id);
  }
}
