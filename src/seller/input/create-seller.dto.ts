import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateSellerDto {
  @IsString()
  @Length(4, 200)
  @ApiProperty()
  name: string;

  @Length(0, 200)
  @ApiProperty()
  description?: string;

  @Length(5, 200)
  @ApiProperty()
  address?: string;
}
