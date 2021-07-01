import { IsDateString, IsString, Length } from "class-validator";

export class CreateCatalogDto {
  @IsString()
  @Length(5, 250)
  name: string;
  image: string;
  description?: string;
  @IsDateString()
  when: Date;
  priority?: number;
}
