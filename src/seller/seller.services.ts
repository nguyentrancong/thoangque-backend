import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entity/user.entity";
import { OrderBy } from "src/catalog/input/list.catalog";
import { paginate, PaginateOptions } from "src/pagination/paginator";
import { DeleteResult, Repository } from "typeorm";
import { Seller } from "./entity/seller.entity";
import { CreateSellerDto } from "./input/create-seller.dto";
import { ListSellers } from "./input/list.seller";
import { UpdateSellerDto } from "./input/update-seller.dto";

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
      .orderBy("s.createDate", OrderBy.DESC);
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

    // if (filter?.createDate) {
    //   this.logger.log(
    //     `Filter | createDate: ${filter.createDate} ${typeof filter.createDate}`
    //   );

    //   if (CreateFilter.Today == filter?.createDate) {
    //     this.logger.log(`Filter | createDate: today`);
    //     query = query.andWhere(
    //       `s.createDate >= CURDATE() AND s.createDate <= CURDATE() + INTERVAL 1 DAY`
    //     );
    //   }
    //   if (CreateFilter.Yesterday == filter?.createDate) {
    //     query = query.andWhere(
    //       `s.createDate >= CURDATE() - INTERVAL 2 DAY AND s.createDate <= CURDATE() - INTERVAL 1 DAY`
    //     );
    //   }
    //   if (CreateFilter.ThisWeek == filter?.createDate) {
    //     query = query.andWhere(
    //       `YEARWEEK(s.createDate, 1) = YEARWEEK(CURDATE(), 1)`
    //     );
    //   }
    //   if (CreateFilter.LastWeek == filter?.createDate) {
    //     query = query.andWhere(
    //       `YEARWEEK(s.createDate, 1) - 1 = YEARWEEK(CURDATE(), 1)`
    //     );
    //   }
    // }
    // if (filter?.updateDate) {
    //   //todo: the same create date
    // }

    if (filter?.keyword) {
      query = query.andWhere(
        `s.name LIKE '%${filter?.keyword}%' or s.description LIKE '%${filter?.keyword}%'`
      );
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
    this.logger.log(`${this.getSeller.name} | get sql: ${sellers.getSql()}`);
    return await sellers.getOne();
  }

  public async createSeller(input: CreateSellerDto, user: User) {
    const seller_ = await this.sellerRepository.findOne({
      where: [{ user }],
    });
    if (seller_) {
      throw new BadRequestException([
        "Một tài khoản (user) chỉ được tạo một nhà bán (seller)",
      ]);
    }

    const seller = new Seller();
    seller.name = input.name;
    seller.description = input.description;
    seller.address = input.address;
    seller.user = user;
    await this.sellerRepository.save(seller);
    this.logger.log(`${this.createSeller.name} | input: ${seller}`);
    return seller;
  }

  public async updateSeller(input: UpdateSellerDto, user: User) {
    this.logger.log(`${this.updateSeller.name} | input: ${input}`);
    const seller = await this.sellerRepository.findOne({ where: [{ user }] });
    if (!seller) {
      throw new NotFoundException();
    }
    const sellerUpdate = await this.sellerRepository.save({
      ...seller,
      ...input,
    });
    return sellerUpdate;
  }

  public async deleteSeller(user: User): Promise<DeleteResult> {
    const seller = await this.sellerRepository.findOne({ where: [{ user }] });
    if (!seller) {
      throw new NotFoundException();
    }
    return await this.sellerRepository
      .createQueryBuilder("seller")
      .delete()
      .where("seller.id = :id", { id: seller.id })
      .execute();
  }
}
