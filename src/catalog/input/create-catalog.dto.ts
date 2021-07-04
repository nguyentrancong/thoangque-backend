import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString, Length } from "class-validator";

export class CreateCatalogDto {
  @IsString()
  @Length(5, 250)
  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  priority?: number;
}
