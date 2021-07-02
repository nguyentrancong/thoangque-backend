import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateProductDto {
  @IsString()
  @Length(5, 200)
  @ApiProperty()
  name: string;

  @Length(5, 200)
  @ApiProperty()
  description: string;

  @Length(5, 200)
  @ApiProperty()
  image: string;
}
