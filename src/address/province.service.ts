import { Logger, NotFoundException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderBy } from "src/commons/input/orderBy";
import { paginate, PaginateOptions } from "src/pagination/paginator";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Province } from "./entity/address.province.entity";
import { ListProvince } from "./input/list.province";

@Injectable()
export class ProvinceService {
  // private readonly logger = new Logger(ProvinceService.name);

  constructor(
    @InjectRepository(Province)
    private readonly provinceService: Repository<Province>
  ) {}

  private getProvincesBaseQuery() {
    const query = this.provinceService
      .createQueryBuilder("province")
      .orderBy("province.matp", OrderBy.DESC);
    return query;
  }

  // provinces with district
  public getProvincesWithDistricts() {
    return this.getProvincesBaseQuery().leftJoinAndSelect(
      "province.districts",
      "district"
    );
  }

  // province with district and ward
  public getProvincesWithDistrictsAndWards() {
    return this.getProvincesWithDistricts().leftJoinAndSelect(
      "district.wards",
      "ward"
    );
  }

  // only province with map filter
  private async getProvincesWithMapFilter(
    query: SelectQueryBuilder<Province>,
    filter: ListProvince
  ) {
    let newQuery = query;
    if (!filter) {
      return await newQuery;
    }
    if (filter?.keyword) {
      newQuery = newQuery.andWhere(
        `province.slug LIKE '%${filter?.keyword}%' or province.slug LIKE '%${filter?.keyword}%'`
      );
    }
    return newQuery;
  }

  // only provinces
  public async getProvincesWithMapFilterPaginated(
    filter: ListProvince,
    paginatiions: PaginateOptions
  ) {
    const query = this.getProvincesBaseQuery();
    return paginate(
      await this.getProvincesWithMapFilter(query, filter),
      paginatiions
    );
  }
}
