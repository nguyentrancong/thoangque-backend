import { Delete, Get, HttpCode, Patch, Post } from "@nestjs/common";
import { Controller, Logger } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserAddressService } from "./user-address.service";

@ApiTags("User Address")
@Controller("/userAddress")
export class UserAddressController {
  private readonly logger = new Logger(UserAddressController.name);
  constructor(private readonly userAddressService: UserAddressService) {}

  @Get()
  async find() {
    return "find all address";
  }

  @Get(":id")
  async findOne() {
    return "find one address";
  }

  @Post()
  async create() {
    return "create address";
  }

  @Patch("/update/:id")
  async update() {
    return "update address";
  }

  @Delete("/delete/:id")
  @HttpCode(204)
  async delete() {
    return "delete address";
  }
}
