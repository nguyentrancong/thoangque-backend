import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PaginateOptions } from "src/pagination/paginator";
import { Province } from "./entity/address.province.entity";
import { ListProvince } from "./input/list.province";
import { ProvinceService } from "./province.service";

@Injectable()
export class AddressService {
  // private readonly logger = new Logger(AddressService.name);
  constructor(private readonly provinceService: ProvinceService) {}

  //provinces
  public async getProvinces(
    filter: ListProvince,
    paginations: PaginateOptions
  ) {
    const result =
      await this.provinceService.getProvincesWithMapFilterPaginated(
        filter,
        paginations
      );
    return result;
  }

  //province with district
  public async getProvinceWithDistricts(
    matp: string
  ): Promise<Province | undefined> {
    const query = this.provinceService
      .getProvincesWithDistricts()
      .andWhere("province.matp = :matp", {
        matp,
      });
    // this.logger.log(
    //   `${this.getProvinceWithDistricts} | query ${query.getSql()}`
    // );
    const result = await query.getOne();
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  //province with districts and wards
  public async getProvinceWithDistrictsAndWards(
    matp: string
  ): Promise<Province | undefined> {
    const query = this.provinceService
      .getProvincesWithDistrictsAndWards()
      .andWhere("province.matp = :matp", {
        matp,
      });
    // this.logger.log(
    //   `${this.getProvinceWithDistrictsAndWards} | query ${query.getSql()}`
    // );
    const result = await query.getOne();
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
