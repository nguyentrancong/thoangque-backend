import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entity/user.entity";
import { OrderBy } from "src/commons/input/orderBy";
import { paginate, PaginateOptions } from "src/pagination/paginator";
import { Repository } from "typeorm";
import { UserAddress } from "./entity/user-address.entity";
import { CreateUserAddressDto } from "./input/create-user-address.dto";
import { ListUserAddress } from "./input/list.user-address";
import { UpdateUserAddressDto } from "./input/update-user-address.dto";
import { clone } from "lodash";

@Injectable()
export class UserAddressService {
  private readonly logger = new Logger(UserAddressService.name);
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>
  ) {}

  private getUserAddressBaseQuery() {
    return this.userAddressRepository
      .createQueryBuilder("user_address")
      .orderBy("user_address.id", OrderBy.DESC);
  }

  private getUserAddressBaseQueryAndMap() {
    return this.getUserAddressBaseQuery();
  }

  private async getUserAddressBaseQueryAndMapWithFilter(
    user: User,
    filter: ListUserAddress
  ) {
    const query = this.getUserAddressBaseQueryAndMap().andWhere(
      "user_address.userId = :userId",
      { userId: user.id }
    );
    // TODO: Filter
    return query;
  }

  public async getUserAddressAndMapWithFilterPaginatons(
    user: User,
    filter: ListUserAddress,
    paginateOptions: PaginateOptions
  ) {
    return paginate(
      await this.getUserAddressBaseQueryAndMapWithFilter(user, filter),
      paginateOptions
    );
  }

  public async getUserAddress(
    user: User,
    id: number
  ): Promise<UserAddress | undefined> {
    const query = this.getUserAddressBaseQueryAndMap().andWhere(
      "user_address.userId = :userId",
      { userId: user.id }
    );
    // .andWhere("user_address.id = :id", { id });
    return await query.getOne();
  }

  public async createUserAddress(user: User, input: CreateUserAddressDto) {
    const userAddress = new UserAddress();
    userAddress.user = user;
    userAddress.province = input.province;
    userAddress.district = input.district;
    userAddress.ward = input.ward;
    userAddress.phone = input.phone;
    userAddress.addressLine = input.addressLine;
    userAddress.typeAddress = input.typeAddress;
    userAddress.defaultAddress = input.defaultAddress;
    userAddress.fullName = input.fullName;
    return await this.userAddressRepository.save(userAddress);
  }
  public async updateUserAddress(
    user: User,
    input: UpdateUserAddressDto,
    id: number
  ) {
    const userAddress = await this.getUserAddressBaseQuery()
      .andWhere("user_address.userId = :userId", { userId: user.id })
      .andWhere("user_address.id = :id", { id })
      .getOne();
    if (!userAddress) {
      throw new NotFoundException([`Update | Not found address with id ${id}`]);
    }

    const newUserAddress = clone(userAddress);
    newUserAddress.province = input.province;
    newUserAddress.district = input.district;
    newUserAddress.ward = input.ward;
    newUserAddress.phone = input.phone;
    newUserAddress.addressLine = input.addressLine;
    newUserAddress.typeAddress = input.typeAddress;
    newUserAddress.defaultAddress = input.defaultAddress;
    newUserAddress.fullName = input.fullName;

    return await this.userAddressRepository.save(newUserAddress);
  }

  public async deleteUserAddress(user: User, id: number) {
    const userAddress = await this.getUserAddressBaseQuery()
      .andWhere("user_address.userId = :userId", { userId: user.id })
      .andWhere("user_address.id = :id", { id })
      .getOne();
    if (!userAddress) {
      throw new NotFoundException([`Delete | Not found address with id ${id}`]);
    }
    return await this.userAddressRepository
      .createQueryBuilder("user_address")
      .delete()
      .where("user_address.id = :id", { id })
      .execute();
  }
}
