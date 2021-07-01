import { IsString, Length } from "class-validator";

export class CreateProductDto {
  @IsString()
  @Length(5, 200)
  name: string;

  @Length(5, 200)
  description: string;

  @Length(5, 200)
  image: string;
}
