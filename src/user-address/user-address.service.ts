import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserAddress } from "./entity/user-address.entity";

@Injectable()
export class UserAddressService {
  private readonly logger = new Logger(UserAddressService.name);
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>
  ) {}
}
