import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Seller } from "./entity/seller.entity.dto";

@Injectable()
export class SellerService {
  private readonly logger = new Logger(SellerService.name);

  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>
  ) {}

  private getSellersBaseQuery() {
    const query = this.sellerRepository
      .createQueryBuilder("s")
      .orderBy("s.id", "DESC");
    return query;
  }

  public getSellerWithCatalogCountQuery() {
    return this.getSellersBaseQuery()
      .loadRelationCountAndMap("s.catalogCount", "s.catalogs")
      .loadRelationCountAndMap("s.productCount", "s.products");
  }

  public async getSeller(id: number): Promise<Seller | undefined> {
    const sellers = this.getSellerWithCatalogCountQuery().andWhere(
      "s.id = :id",
      { id }
    );
    this.logger.log(`Get seller | get sql: ${sellers}`);
    return await sellers.getOne();
  }
}
