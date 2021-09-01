import { PartialType } from "@nestjs/swagger";
import { CreateProductInCartDto } from "./create-productInCart.dto";

export class UpdateProductInCartDto extends PartialType(
  CreateProductInCartDto
) {}
