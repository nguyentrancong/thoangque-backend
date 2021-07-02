import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ListSellers {
  @ApiProperty({
    enum: ["All", "Today", "ThisWeek", "Yesterday", "LastWeek"],
  })
  createDate?: CreateProductFilter = CreateProductFilter.All;

  @ApiProperty({
    enum: ["All", "Today", "ThisWeek", "Yesterday", "LastWeek"],
  })
  updateDate?: UpdateProductFilter = UpdateProductFilter.All;

  @ApiPropertyOptional()
  keyword?: string;

  @ApiProperty({ enum: ["DESC", "ASC"] })
  orderBy?: ProductOrderBy = ProductOrderBy.DESC;

  @ApiProperty()
  page: number = 1;

  @ApiProperty()
  limit: number = 10;
}

export enum CreateProductFilter {
  All = 1,
  Today,
  ThisWeek,
  Yesterday,
  LastWeek,
}

export enum UpdateProductFilter {
  All = 1,
  Today,
  ThisWeek,
  Yesterday,
  LastWeek,
}

export enum ProductOrderBy {
  DESC = "DESC",
  ASC = "ASC",
}
