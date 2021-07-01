import { Logger, ParseIntPipe } from "@nestjs/common";
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
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Catalog } from "./entity/catalog.entity";
import { CreateCatalogDto } from "./input/create-catalog.dto";
import { UpdateCatalogDto } from "./input/update-catalog.dto";

@Controller("/catalog")
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);
  constructor(
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>
  ) {}

  @Get()
  async findAll() {
    const catalogs = await this.catalogRepository.find({
      relations: ["products"],
    });
    this.logger.log(`findAll: ${catalogs.length}`);
    return catalogs;
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const catalog = await this.catalogRepository.findOne(id, {
      relations: ["products"],
    });
    if (!catalog) {
      throw new NotFoundException();
    }
    this.logger.log(`findOne: ${catalog}`);
    return catalog;
  }

  @Post()
  async create(@Body() input: CreateCatalogDto) {
    this.logger.log(`create: ${input}`);
    return await this.catalogRepository.save(input);
  }

  @Post(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() input: UpdateCatalogDto
  ) {
    const catalog = await this.catalogRepository.findOne(id);
    if (!catalog) {
      throw new NotFoundException();
    }
    this.logger.log(`update: ${catalog}`);
    return input;
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id", ParseIntPipe) id: number) {
    const catalog = await this.catalogRepository.findOne(id);
    if (!catalog) {
      throw new NotFoundException();
    }
    this.logger.log(`remove: ${catalog}`);
    this.catalogRepository.delete(id);
  }
}
