import { ApiProperty } from "@nestjs/swagger";

export class CreateProductInCartDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;
}
