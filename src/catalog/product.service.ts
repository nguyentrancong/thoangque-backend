import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entity/product.entity";

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  private getProductsBaseQuery() {
    const query = this.productRepository
      .createQueryBuilder("p")
      .orderBy("p.id", "DESC");
    return query;
  }

  public async getProduct(id: number): Promise<Product | undefined> {
    const products = this.getProductsBaseQuery().andWhere("p.id = :id", { id });
    this.logger.log(`Get product | get sql: ${products.getSql()}`);
    return await products.getOne();
  }
}
