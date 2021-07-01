import { Body, Logger, NotFoundException, Param, Post } from "@nestjs/common";
import { Get, ParseIntPipe } from "@nestjs/common";
import { Controller, Delete } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entity/product.entity";
import { Catalog } from "./entity/catalog.entity";
import { CreateProductDto } from "./input/create-product.dto";
import { UpdateProductDto } from "./input/update-product.dto";

@Controller("/product")
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>
  ) {}

  @Get()
  async findAll() {
    const products = await this.productRepository.find({
      relations: ["catalog"],
    });
    this.logger.log(`FindAll: ${products.length}`);
    return products;
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException();
    }
    this.logger.log(`FindAll: ${product}`);
    return product;
  }

  @Post(":id")
  async create(
    @Param("id", ParseIntPipe) id: number,
    @Body() input: CreateProductDto
  ) {
    const catalog = await this.catalogRepository.findOne(id, {
      relations: ["products"],
    });
    if (!catalog) {
      throw new NotFoundException();
    }
    const product = new Product();
    product.name = input.name;
    product.image = input.image;
    product.description = input.description;
    catalog.products.push(product);

    await this.catalogRepository.save(catalog);
    return catalog;
  }

  @Post(":id")
  async updater(
    @Param("id", ParseIntPipe) id: number,
    @Body() input: UpdateProductDto
  ) {}

  @Delete(":id")
  async remove() {}
}
