import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { Get, Controller, Logger, Post, Body, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./input/create-user.dto";
import { User } from "./entity/user.entity";
import { BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Patch } from "@nestjs/common";
import { UpdateUserDto } from "./input/update-user.dto";
import { AuthGuardJwt } from "./auth-guard.jwt";
import { CurrentUser } from "./current-user.decorator";

@ApiTags("User")
@Controller("/user")
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly authService: AuthService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  @Post("/create")
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = new User();

    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(["Passwords are not identical"]);
    }

    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new BadRequestException(["username or email is already taken"]);
    }

    user.username = createUserDto.username;
    user.password = await this.authService.hashPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user),
    };
  }

  @Patch("/update")
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(AuthGuardJwt)
  @ApiBearerAuth()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User
  ) {
    this.logger.log(`Get profile: ${user}`);

    if (
      user.email !== updateUserDto.email ||
      user.username !== updateUserDto.username
    ) {
      throw new BadRequestException(["username or email is not change"]);
    }
    return await this.userRepository.save({ ...user, ...updateUserDto });
  }
}
