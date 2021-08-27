import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ward } from "./entity/address.ward.entity";

@Injectable()
export class WardService {
  private readonly logger = new Logger(WardService.name);

  constructor(
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>
  ) {}

  private getWardsBaseQuery() {
    const query = this.wardRepository
      .createQueryBuilder("ward")
      .orderBy("ward.xaid", "DESC");
    return query;
  }

  public async getWards() {
    const result = await this.getWardsBaseQuery().getMany();
    this.logger.log(`${this.getWards.name} | result: ${result}`);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
