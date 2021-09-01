import { ApiProperty } from "@nestjs/swagger";
import { CreateProductInCartDto } from "src/cart/input/create-productInCart.dto";

export class CreateOrderDto {
  @ApiProperty()
  order: CreateProductInCartDto[];

  @ApiProperty()
  address: string;
}
