import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ListProvince {
  @ApiPropertyOptional()
  keyword?: string;

  @ApiProperty()
  page: number = 1;

  @ApiProperty()
  limit: number = 100;
}
