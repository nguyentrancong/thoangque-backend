import { Body } from "@nestjs/common";
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
import { InjectRepository } from "@nestjs/typeorm";
import { Catalog } from "src/catalog/entity/catalog.entity";
import { Repository } from "typeorm";
import { Seller } from "./entity/seller.entity.dto";
import { CreateSellerDto } from "./input/create-seller.dto";
import { ListSellers } from "./input/list.seller";
import { UpdateSellerDto } from "./input/update-seller.dto";
import { SellerService } from "./seller.services";

@Controller("/seller")
export class SellerController {
  private readonly logger = new Logger(SellerController.name);
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>,

    private readonly sellerService: SellerService
  ) {}

  @Get()
  async findAll(@Query() filter: ListSellers) {
    const sellers = await this.sellerService.getSellerWithCountAndMapFilter(
      filter
    );
    this.logger.log(`FindAll: ${sellers.length}`);
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

  @Post()
  async xx() {
    const catalog1 = await this.catalogRepository.findOne(1);
    const catalog2 = await this.catalogRepository.findOne(2);
    const seller = new Seller();
    seller.name = "thoang que22 222";
    seller.description = "huong vi viet";
    seller.catalogs = [catalog1, catalog2];
    await this.sellerRepository.save(seller);
  }

  //   @Post()
  //   async create(@Body() input: CreateSellerDto) {
  //     this.logger.log(`Create: ${input}`);
  //     return input;
  //   }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() input: UpdateSellerDto
  ) {
    return input;
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {}
}
