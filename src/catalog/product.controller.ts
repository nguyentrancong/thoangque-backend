import { Body, Logger, NotFoundException, Param, Post } from "@nestjs/common";
import { Get, ParseIntPipe } from "@nestjs/common";
import { Controller, Delete } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entity/product.entity";
import { Catalog } from "./entity/catalog.entity";
import { CreateProductDto } from "./input/create-product.dto";
import { UpdateProductDto } from "./input/update-product.dto";
import { Patch } from "@nestjs/common";
import { Seller } from "src/seller/entity/seller.entity.dto";
import { ProductService } from "./product.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Product")
@Controller("/product")
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,

    private readonly productService: ProductService
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
    const product = await this.productService.getProduct(id);
    if (!product) {
      throw new NotFoundException();
    }
    this.logger.log(`FindOne: ${product}`);
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

    const seller = await this.sellerRepository.findOne(1, {
      relations: ["products"],
    });
    if (!catalog) {
      throw new NotFoundException();
    }
    const product = new Product();
    product.name = input.name;
    product.image = input.image;
    product.description = input.description;
    product.seller = seller;
    catalog.products.push(product);
    await this.catalogRepository.save(catalog);
    return catalog;
  }

  @Patch(":id")
  async updater(
    @Param("id", ParseIntPipe) id: number,
    @Body() input: UpdateProductDto
  ) {}

  @Delete(":id")
  async remove() {}
}
