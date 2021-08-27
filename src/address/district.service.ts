import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { District } from "./entity/address.district.entity";

@Injectable()
export class DistrictService {
  private readonly logger = new Logger(DistrictService.name);
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>
  ) {}

  private getDistrictsBaseQuery() {
    const query = this.districtRepository
      .createQueryBuilder("district")
      .orderBy("district.maqh", "DESC");
    return query;
  }

  public async getDistricts() {
    const result = await this.getDistrictsBaseQuery().getMany();
    this.logger.log(`${this.getDistricts.name} | result: ${result}`);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
