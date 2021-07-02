import { IsString, Length } from "class-validator";

export class CreateSellerDto {
  @IsString()
  @Length(1, 200)
  name: string;

  @Length(0, 200)
  description?: string;
}
