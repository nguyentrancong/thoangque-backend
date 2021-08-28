import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entity/user.entity";
import { OrderBy } from "src/commons/input/OrderBy";
import { paginate, PaginateOptions } from "src/pagination/paginator";
import { SellerService } from "src/seller/seller.services";
import { Repository } from "typeorm";
import { CatalogService } from "../cataglog.service";
import { Product } from "../entity/product.entity";
import { CreateProductDto } from "../input/create-product.dto";
import { ListProduct } from "../input/list.product";
import { UpdateProductDto } from "../input/update-product.dto";

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly sellerService: SellerService,
    private readonly catalogService: CatalogService
  ) {}

  private getProductsBaseQuery() {
    const query = this.productRepository
      .createQueryBuilder("p")
      .orderBy("p.id", OrderBy.DESC);
    return query;
  }

  private getProductsAndMap() {
    return this.getProductsBaseQuery()
      .leftJoinAndSelect("p.seller", "seller")
      .leftJoinAndSelect("p.catalog", "catalog");
  }

  private getProductsAndMapFilter(filter: ListProduct) {
    let query = this.getProductsAndMap();
    if (!filter) {
      return query;
    }

    if (filter?.keyword) {
      query = query.andWhere(
        `p.name LIKE %${filter?.keyword}% or p.description LIKE %${filter?.keyword}%`
      );
    }

    return query;
  }

  public async getProductsAndMapFilterPaginations(
    filter: ListProduct,
    paginations: PaginateOptions
  ) {
    const result = paginate(
      await this.getProductsAndMapFilter(filter),
      paginations
    );
    this.logger.log(
      `${this.getProductsAndMapFilterPaginations.name} : result: ${result}`
    );
    return result;
  }

  public async getProduct(id: number): Promise<Product | undefined> {
    const products = this.getProductsAndMap().andWhere("p.id = :id", { id });
    const result = await products.getOne();
    this.logger.log(`${this.getProduct.name} | result: ${result}`);
    return result;
  }

  public async createProduct(
    sellerId: number,
    catalogId: number,
    input: CreateProductDto,
    user: User
  ) {
    // TODO: check điều kiên đc tạo

    const seller = await this.sellerService.getSeller(sellerId);
    if (!seller) {
      throw new BadRequestException([
        `không tìm thấy nhà báo có id: ${sellerId}`,
      ]);
    }

    const catalog = await this.catalogService.getCatalog(catalogId);
    if (!catalog) {
      throw new BadRequestException([
        `Không tìm thấy catalog có id: ${catalogId}`,
      ]);
    }

    const product = new Product();
    product.name = input.name;
    product.image = input.image;
    product.description = input.description;
    product.seller = seller;

    catalog.products.push(product);
    await this.catalogService.save(catalog);
    return product;
    // const result = await this.productRepository.save(input);
    // this.logger.log(`${this.getProduct.name} | result: ${result}`);
    // return result;
  }

  public async updateProduct(id: number, input: UpdateProductDto, user: User) {
    // TODO: check điều kiên đc update
    const product = await this.getProduct(id);

    if (!product) {
      throw new BadRequestException([`không tìm thấy sản phẩm có id: ${id}`]);
    }

    const result = await this.productRepository.save({ ...product, ...input });
    this.logger.log(`${this.updateProduct.name}: result: ${result}`);
    return result;
  }

  public async deleteProduct(id: number, user: User) {
    // TODO: check điều kiên đc xoa

    const product = await this.getProduct(id);

    if (!product) {
      throw new BadRequestException([`không tìm thấy sản phẩm có id: ${id}`]);
    }

    return this.productRepository
      .createQueryBuilder("product")
      .delete()
      .where("product.id = :id", { id })
      .execute();
  }
}
