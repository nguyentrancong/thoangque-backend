import { NotFoundException, Query } from "@nestjs/common";
import { Controller, Get, Logger, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaginateOptions } from "src/pagination/paginator";
import { AddressService } from "./address.service";
import { ListProvince } from "./input/list.province";

@ApiTags("Address-Vietname")
@Controller("/address")
export class AddressController {
  private readonly logger = new Logger(AddressController.name);
  constructor(private readonly addressService: AddressService) {}

  @Get("/provinces")
  async findAll(@Query() filter: ListProvince) {
    const paginations: PaginateOptions = {
      currentPage: filter.page,
      limit: filter.limit,
      total: true,
    };
    const provinces = await this.addressService.getProvinces(
      filter,
      paginations
    );
    if (!provinces) {
      throw new NotFoundException();
    }
    return provinces;
  }

  @Get("provinceWithDistricts/:matp")
  async findOneWithDistricts(@Param("matp") matp: string) {
    // chưa check pase pipe cần sửa
    return await this.addressService.getProvinceWithDistricts(matp);
  }

  @Get("provinceWithDistrictsAndWards/:matp")
  async findOneWithDistrictsAndWards(@Param("matp") matp: string) {
    // chưa check pase pipe cần sửa
    return await this.addressService.getProvinceWithDistrictsAndWards(matp);
  }
}
