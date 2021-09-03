import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateOrderDto {
  @ApiProperty()
  orders: {
    productId: number;
    quantity: number;
  }[];

  @ApiProperty()
  shoppingFee: number;

  @ApiPropertyOptional()
  discountId: number;

  @ApiPropertyOptional()
  storeId: number;
}

// post: create 1 order example
/*
{
  "orders": [
    { "productId": 20, "quantity": 12 },
    { "productId": 21, "quantity": 2 }
  ],
  "shoppingFee": 0,
  "discountId": 0,
  "storeId": 0
}
*/
