import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entity/user.entity";
import { paginate, PaginateOptions } from "src/pagination/paginator";
import { DeleteResult, Repository } from "typeorm";
import { Seller } from "./entity/seller.entity.dto";
import { CreateSellerDto } from "./input/create-seller.dto";
import { CreateFilter, ListSellers, OrderBy } from "./input/list.seller";
import { UpdateSellerDto } from "./input/update-seller.dto";

@Injectable()
export class SellerService {
  private readonly logger = new Logger(SellerService.name);

  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  private getSellersBaseQuery() {
    const query = this.sellerRepository
      .createQueryBuilder("s")
      .orderBy("s.createDate", OrderBy.DESC);
    return query;
  }

  public async getUser(id: number) {
    return await this.userRepository.findOne(id, { relations: ["seller"] });
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

      if (CreateFilter.Today == filter?.createDate) {
        this.logger.log(`Filter | createDate: today`);
        query = query.andWhere(
          `s.createDate >= CURDATE() AND s.createDate <= CURDATE() + INTERVAL 1 DAY`
        );
      }
      if (CreateFilter.Yesterday == filter?.createDate) {
        query = query.andWhere(
          `s.createDate >= CURDATE() - INTERVAL 2 DAY AND s.createDate <= CURDATE() - INTERVAL 1 DAY`
        );
      }
      if (CreateFilter.ThisWeek == filter?.createDate) {
        query = query.andWhere(
          `YEARWEEK(s.createDate, 1) = YEARWEEK(CURDATE(), 1)`
        );
      }
      if (CreateFilter.LastWeek == filter?.createDate) {
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

  public async createSeller(input: CreateSellerDto, user: User) {
    this.logger.log(`create seller: input: ${input} | user: ${user}`);
    const userSeller = await this.userRepository.findOne(user.id, {
      relations: ["seller"],
    });
    this.logger.debug(`${userSeller?.seller}`);
    if (userSeller?.seller) {
      throw new BadRequestException([
        "Một tài khoản (user) chỉ được tạo một nhà bán (seller)",
      ]);
    }
    const seller = await this.sellerRepository.save({
      ...input,
      userId: user.id,
    });
    await this.userRepository.save({ ...user, seller });
    return seller;
  }

  public async updateSeller(seller: Seller, input: UpdateSellerDto) {
    return await this.sellerRepository.save({ ...seller, ...input });
  }

  public async deleteSeller(id: number, user: User): Promise<DeleteResult> {
    await this.userRepository.save({ ...user, seller: null });
    return await this.sellerRepository
      .createQueryBuilder("seller")
      .delete()
      .where("seller.id = :id", { id })
      .execute();
  }
}
