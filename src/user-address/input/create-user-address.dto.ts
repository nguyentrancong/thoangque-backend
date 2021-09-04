import { ApiProperty } from "@nestjs/swagger";

export class CreateUserAddressDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  ward: string;

  @ApiProperty()
  addressLine: string;

  @ApiProperty()
  typeAddress: number;

  @ApiProperty()
  defaultAddress: number;
}
