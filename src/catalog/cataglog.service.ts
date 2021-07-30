import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entity/user.entity";
import { paginate, PaginateOptions } from "src/pagination/paginator";
import { Seller } from "src/seller/entity/seller.entity.dto";
import { Repository } from "typeorm";
import { Catalog } from "./entity/catalog.entity";
import { CreateCatalogDto } from "./input/create-catalog.dto";
import { CreateFilter, ListCatalog, OrderBy } from "./input/list.catalog";
import { UpdateCatalogDto } from "./input/update-catalog.dto";

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);
  constructor(
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>,

    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>
  ) {}

  private getCatalogsBaseQuery() {
    return this.catalogRepository
      .createQueryBuilder("c")
      .orderBy("c.id", OrderBy.DESC);
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

  private async getCatalogWithCountAndMapFilter(filter: ListCatalog) {
    let query = this.getCatalogWithCountAndMap();

    if (!filter) {
      return await query;
    }

    if (filter?.createDate) {
      this.logger.log(
        `Filter | createDate: ${filter.createDate} ${typeof filter.createDate}`
      );
      //todo: cần fix
      if (CreateFilter.Today == filter?.createDate) {
        this.logger.log(`Filter | createDate: today`);
        query = query.andWhere(
          `c.createDate >= CURDATE() AND c.createDate <= CURDATE() + INTERVAL 1 DAY`
        );
      }
      if (CreateFilter.Yesterday == filter?.createDate) {
        query = query.andWhere(
          `c.createDate >= CURDATE() - INTERVAL 2 DAY AND c.createDate <= CURDATE() - INTERVAL 1 DAY`
        );
      }
      if (CreateFilter.ThisWeek == filter?.createDate) {
        query = query.andWhere(
          `YEARWEEK(c.createDate, 1) = YEARWEEK(CURDATE(), 1)`
        );
      }
      if (CreateFilter.LastWeek == filter?.createDate) {
        query = query.andWhere(
          `YEARWEEK(c.createDate, 1) - 1 = YEARWEEK(CURDATE(), 1)`
        );
      }
    }
    if (filter?.updateDate) {
      //todo: the same create date
    }
    if (filter?.keyword) {
      query = query.andWhere(`c.name LIKE '%${filter?.keyword}%'`);
    }

    return await query;
  }

  public async getCatalogWithCountAndMapFilterPaginated(
    filter: ListCatalog,
    paginateOptions: PaginateOptions
  ) {
    return await paginate(
      await this.getCatalogWithCountAndMapFilter(filter),
      paginateOptions
    );
  }

  public async createCatalog(input: CreateCatalogDto, user: User) {
    this.logger.log(`user.role: ${user?.role}`);
    if (user?.role !== 1) {
      //todo: how to fix role in here
      throw new BadRequestException([
        "Tài khoản Bạn không có quyền tại danh mục",
      ]);
    }
    this.logger.log(`create | input: ${input}`);
    return this.catalogRepository.save(input);
  }

  public async updateCatalog(id: number, input: UpdateCatalogDto, user: User) {
    if (user?.role !== 1) {
      //todo: how to fix role in here
      throw new BadRequestException([
        "Tài khoản Bạn không có quyền cập nhật danh mục",
      ]);
    }
    const catalog = await this.getCatalog(id);
    if (!catalog) {
      throw new NotFoundException([`không tìm thấy danh mục`]);
    }
    this.logger.log(`UdateCatalog | input: ${input}`);
    return await this.catalogRepository.save({ ...catalog, ...input });
  }

  public async deleteCatalog(id: number, user: User) {
    if (user?.role !== 1) {
      //todo: how to fix role in here
      throw new BadRequestException([
        "Tài khoản Bạn không có quyền cập nhật danh mục",
      ]);
    }
    const catalog = await this.getCatalog(id);
    if (!catalog) {
      throw new NotFoundException([`không tìm thấy danh mục`]);
    }
    if (catalog?.products?.length > 0 || catalog?.sellers?.length > 0) {
      throw new BadRequestException([
        `Không thể xoá được đang có -> products or -> sellers`,
      ]);
    }
    return await this.catalogRepository
      .createQueryBuilder("catalog")
      .delete()
      .where("catalog.id = :id", { id })
      .execute();
  }
}
