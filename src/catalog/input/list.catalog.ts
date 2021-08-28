import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ListCatalog {
  @ApiProperty({
    enum: ["All", "Today", "ThisWeek", "Yesterday", "LastWeek"],
  })
  createDate?: CreateFilter = CreateFilter.All;

  @ApiProperty({
    enum: ["All", "Today", "ThisWeek", "Yesterday", "LastWeek"],
  })
  updateDate?: UpdateFilter = UpdateFilter.All;

  @ApiPropertyOptional()
  keyword?: string;

  @ApiProperty()
  page: number = 1;

  @ApiProperty()
  limit: number = 10;
}

export enum CreateFilter {
  All = 1,
  Today,
  ThisWeek,
  Yesterday,
  LastWeek,
}

export enum UpdateFilter {
  All = 1,
  Today,
  ThisWeek,
  Yesterday,
  LastWeek,
}
