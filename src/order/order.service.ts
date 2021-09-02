import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entity/user.entity";
import { OrderBy } from "src/commons/input/OrderBy";
import { paginate, PaginateOptions } from "src/pagination/paginator";
import { Repository } from "typeorm";
import { Order } from "./entity/order.entity";
import { CreateOrderDto } from "./input/create-order.dto";
import { ListOrder } from "./input/list.order";
import { UpdateOrderDto } from "./input/update-order.dto";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) {}

  private getOrdersBaseQuery() {
    return this.orderRepository
      .createQueryBuilder("order")
      .orderBy("order.id", OrderBy.DESC);
  }

  private getOrdersBaseQueryAndMap() {
    return this.getOrdersBaseQuery();
  }

  private async getOrdersBaseQueryAndMapWithFilter(
    filters: ListOrder,
    user: User
  ) {
    return this.getOrdersBaseQueryAndMap();
  }

  public async getOrders(
    user: User,
    filters: ListOrder,
    paginations: PaginateOptions
  ) {
    return paginate(
      await this.getOrdersBaseQueryAndMapWithFilter(filters, user),
      paginations
    );
  }

  public async getOrder(user: User, id: number): Promise<Order | undefined> {
    const query = this.getOrdersBaseQueryAndMap()
      .andWhere("order.userId = :userId", { userId: user.id })
      .andWhere("order.id = :id", { id });
    return await query.getOne();
  }

  public async createOrder(user: User, input: CreateOrderDto) {
    // TODO:
  }

  public async updateOrder(user: User, input: UpdateOrderDto, id: number) {
    // TODO: update
  }

  public async deleteOrder(user: User, id: number) {
    // TODO: delete
  }
}
