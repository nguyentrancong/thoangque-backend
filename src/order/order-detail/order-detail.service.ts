import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/entity/user.entity";
import { OrderBy } from "src/commons/input/OrderBy";
import { Repository } from "typeorm";
import { OrderDetail } from "../entity/order-detail.entity";

@Injectable()
export class OrderDetailService {
  private readonly logger = new Logger(OrderDetailService.name);
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>
  ) {}

  private getOrderDetailsBaseQuery() {
    return this.orderDetailRepository
      .createQueryBuilder("order_detail")
      .orderBy("order_detail.id", OrderBy.DESC);
  }

  private getOrderDetailsBaseQueryAndMap() {
    return this.getOrderDetailsBaseQuery().leftJoinAndSelect(
      "order_detail.order",
      "order"
    );
  }

  public async getOrderDetails(user: User) {
    // TODO: get the order details from
  }

  public async getOrderDetail(user: User, id: number) {
    // TODO: get the order detail from
  }

  public async createOrderDetail() {
    // TODO: create the order
  }

  public async updateOrderDetail() {
    // TODO: update the order
  }

  public async deleteOrderDetail() {
    // TODO: delete the order
  }
}
