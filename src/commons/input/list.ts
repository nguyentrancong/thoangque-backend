import { ApiProperty } from "@nestjs/swagger";

export class List {
  @ApiProperty()
  page: number = 1;

  @ApiProperty()
  limit: number = 10;
}
