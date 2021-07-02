import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Catalog } from "./entity/catalog.entity";

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);
  constructor(
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>
  ) {}

  private getCatalogsBaseQuery() {
    return this.catalogRepository
      .createQueryBuilder("c")
      .orderBy("c.id", "DESC");
  }

  public getCatalogDetail() {
    return this.getCatalogsBaseQuery()
      .leftJoinAndSelect("c.sellers", "seller")
      .leftJoinAndSelect("c.products", "product");
  }

  public getCatalogWithCountAndMap() {
    return this.getCatalogsBaseQuery()
      .loadRelationCountAndMap("c.productCount", "c.products")
      .loadRelationCountAndMap("c.sellerCount", "c.sellers");
  }

  public async getCatalog(id: number): Promise<Catalog | undefined> {
    const query = this.getCatalogDetail().andWhere("c.id = :id", { id });
    this.logger.log(`Get catalog | get sql: ${query.getSql()}`);
    return await query.getOne();
  }
}
