import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @Length(5, 200)
  username: string;

  @ApiProperty()
  @Length(6, 20)
  password: string;

  @ApiProperty()
  @Length(6, 20)
  retypedPassword: string;

  @ApiProperty()
  @Length(2, 200)
  firstName: string;

  @ApiProperty()
  @Length(2, 200)
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
