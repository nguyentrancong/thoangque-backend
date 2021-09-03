import {
  Body,
  ClassSerializerInterceptor,
  Delete,
  HttpCode,
  NotFoundException,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Param } from "@nestjs/common";
import { Controller, Get, Logger, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuardJwt } from "src/auth/auth-guard.jwt";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/auth/entity/user.entity";
import { PaginateOptions } from "src/pagination/paginator";
import { CreateOrderDto } from "./input/create-order.dto";
import { ListOrder } from "./input/list.order";
import { UpdateOrderDto } from "./input/update-order.dto";
import { OrderService } from "./order.service";

@ApiTags("Order")
@Controller("Order")
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(private readonly orderService: OrderService) {}

  @Get("/orders")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findOrders(@CurrentUser() user: User, @Query() filters: ListOrder) {
    const paginations: PaginateOptions = {
      currentPage: filters.page,
      limit: filters.limit,
      total: true,
    };
    const result = await this.orderService.getOrders(
      user,
      filters,
      paginations
    );
    return result;
  }

  @Get("/order/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOrder(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number
  ) {
    const result = await this.orderService.getOrder(user, id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  @Post("/order/create")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async createOrder(@CurrentUser() user: User, @Body() input: CreateOrderDto) {
    return await this.orderService.createOrder(user, input);
  }

  @Patch("/order/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async updateOrder(
    @CurrentUser() user: User,
    @Body() input: UpdateOrderDto,
    @Param("id", ParseIntPipe) id: number
  ) {
    return await this.orderService.updateOrder(user, input, id);
  }

  @Delete("/order/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async deleteOrder(
    @CurrentUser() user: User,
    @Param("id", ParseIntPipe) id: number
  ) {
    return await this.orderService.deleteOrder(user, id);
  }
}
