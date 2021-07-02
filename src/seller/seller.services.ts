import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate, PaginateOptions } from "src/pagination/paginator";
import { DeleteResult, Repository } from "typeorm";
import { Seller } from "./entity/seller.entity.dto";
import {
  CreateProductFilter,
  ListSellers,
  ProductOrderBy,
} from "./input/list.seller";

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
      .orderBy("s.createDate", ProductOrderBy.DESC);
    return query;
  }

  public getSellerDetail() {
    return this.getSellersBaseQuery()
      .leftJoinAndSelect("s.products", "product")
      .leftJoinAndSelect("s.catalogs", "catalog");
  }

  public getSellerWithCountAndMap() {
    return this.getSellersBaseQuery()
      .loadRelationCountAndMap("s.catalogCount", "s.catalogs")
      .loadRelationCountAndMap("s.productCount", "s.products");
  }

  private async getSellerWithCountAndMapFilter(filter?: ListSellers) {
    let query = this.getSellerWithCountAndMap();
    if (!filter) {
      return await query;
    }

    if (filter?.createDate) {
      this.logger.log(
        `Filter | createDate: ${filter.createDate} ${typeof filter.createDate}`
      );

      if (CreateProductFilter.Today == filter?.createDate) {
        this.logger.log(`Filter | createDate: today`);
        query = query.andWhere(
          `s.createDate >= CURDATE() AND s.createDate <= CURDATE() + INTERVAL 1 DAY`
        );
      }
      if (CreateProductFilter.Yesterday == filter?.createDate) {
        query = query.andWhere(
          `s.createDate >= CURDATE() - INTERVAL 2 DAY AND s.createDate <= CURDATE() - INTERVAL 1 DAY`
        );
      }
      if (CreateProductFilter.ThisWeek == filter?.createDate) {
        query = query.andWhere(
          `YEARWEEK(s.createDate, 1) = YEARWEEK(CURDATE(), 1)`
        );
      }
      if (CreateProductFilter.LastWeek == filter?.createDate) {
        query = query.andWhere(
          `YEARWEEK(s.createDate, 1) - 1 = YEARWEEK(CURDATE(), 1)`
        );
      }
    }
    if (filter?.updateDate) {
      //todo: the same create date
    }
    if (filter?.keyword) {
      query = query.andWhere(`s.name LIKE '%${filter?.keyword}%'`);
    }

    return await query;
  }

  public async getSellerWithCountAndMapFilterPaginated(
    filter: ListSellers,
    paginateOptions: PaginateOptions
  ) {
    return await paginate(
      await this.getSellerWithCountAndMapFilter(filter),
      paginateOptions
    );
  }

  public async getSeller(id: number): Promise<Seller | undefined> {
    const sellers = this.getSellerDetail().andWhere("s.id = :id", { id });
    this.logger.log(`Get seller | get sql: ${sellers}`);
    return sellers.getOne();
  }

  public async deleteSeller(id: number): Promise<DeleteResult> {
    return await this.sellerRepository
      .createQueryBuilder("s")
      .delete()
      .where("s.id = : id", { id })
      .execute();
  }
}
