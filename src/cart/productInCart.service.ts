import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { filter } from "lodash";
import { User } from "src/auth/entity/user.entity";
import { ProductService } from "src/catalog/product/product.service";
import { OrderBy } from "src/commons/input/orderBy";
import { paginate, PaginateOptions } from "src/pagination/paginator";
import { Repository } from "typeorm";
import { ProductInCart } from "./entity/productInCart.entity";
import { CreateProductInCartDto } from "./input/create-productInCart.dto";
import { ListProductInCart } from "./input/list.productInCart";
import { UpdateProductInCartDto } from "./input/update-productInCart.dto";

@Injectable()
export class ProductInCartService {
  constructor(
    @InjectRepository(ProductInCart)
    private readonly productInCartRepository: Repository<ProductInCart>,

    private readonly productService: ProductService
  ) {}

  private getProductsInCartBaseQuery() {
    return this.productInCartRepository
      .createQueryBuilder("product_in_cart")
      .orderBy("product_in_cart.id", OrderBy.DESC);
  }

  public async getProductsInCart(user: User) {
    const products = this.getProductsInCartBaseQuery().andWhere(
      "product_in_cart.userId = :id",
      { id: user.id }
    );
    return await products.getMany();
  }

  private getProductsInCartBaseQueryandMap(
    user: User,
    filters: ListProductInCart
  ) {
    return this.getProductsInCartBaseQuery()
      .leftJoinAndSelect("product_in_cart.product", "product")
      .andWhere("product_in_cart.userId = :userId", { userId: user.id });
  }

  public async getProductsInCartWithPaginations(
    user: User,
    filters: ListProductInCart,
    paginations: PaginateOptions
  ) {
    return await paginate(
      await this.getProductsInCartBaseQueryandMap(user, filters),
      paginations
    );
  }

  public async getProductInCart(
    id: number,
    user: User
  ): Promise<ProductInCart | undefined> {
    const products = this.getProductsInCartBaseQuery()
      .andWhere("product_in_cart.userId = :userId", { userId: user.id })
      .andWhere("product_in_cart.id = :id", { id })
      .leftJoinAndSelect("product_in_cart.product", "product");
    return await products.getOne();
  }

  public async createProductInCart(input: CreateProductInCartDto, user: User) {
    const product = await this.productService.getProduct(input.productId);
    if (!product) {
      throw new NotFoundException([`Not found product id: ${input.productId}`]);
    }

    if (input.quantity < 1) {
      throw new NotFoundException([
        `Product with quantity must be greater than 0. My quantity is ${input.quantity}`,
      ]);
    }

    const productInCart = new ProductInCart();
    productInCart.quantity = input.quantity;
    productInCart.product = product;
    productInCart.user = user;

    await this.productInCartRepository.save(productInCart);
    return { ...productInCart, user: null };
  }

  public async updateProductInCart(
    id: number,
    input: UpdateProductInCartDto,
    user: User
  ) {
    const productInCart = await this.getProductsInCartBaseQuery()
      .andWhere("product_in_cart.userId = :userId", { userId: user.id })
      .andWhere("product_in_cart.id = :id", { id })
      .getOne();

    if (!productInCart) {
      throw new NotFoundException([
        `Not found product in cart with id : ${id}`,
      ]);
    }

    if (input.quantity < 1) {
      throw new NotFoundException([
        `Product with quantity must be greater than 0. My quantity is ${input.quantity}`,
      ]);
    }

    const newProductInCart = { ...productInCart, quantity: input.quantity };
    await this.productInCartRepository.save(newProductInCart);

    return newProductInCart;
  }

  public async deleteProductInCart(id: number, user: User) {
    const productInCart = await this.getProductsInCartBaseQuery()
      .andWhere("product_in_cart.userId = :userId", { userId: user.id })
      .andWhere("product_in_cart.id = :id", { id })
      .getOne();
    if (!productInCart) {
      throw new NotFoundException([
        `Not found product in cart with id : ${id}`,
      ]);
    }

    return await this.productInCartRepository
      .createQueryBuilder("product_in_cart")
      .delete()
      .where("product_in_cart.id = :id", { id })
      .execute();
  }

  public async deleteProductsInCart(user: User, ids: number[]) {
    let idNotFounds: number[] = [];
    for (var id of ids) {
      console.log(`==>> id ${id}`);
      const productInCart = await this.getProductsInCartBaseQuery()
        .andWhere("product_in_cart.userId = :userId", { userId: user.id })
        .andWhere("product_in_cart.id = :id", { id })
        .getOne();
      if (!productInCart) {
        idNotFounds.push(id);
      }
    }

    if (idNotFounds.length > 0) {
      throw new NotFoundException([
        `${this.deleteProductsInCart.name} | Not found some id: ${idNotFounds}`,
      ]);
    }

    for (var id of ids) {
      await this.productInCartRepository
        .createQueryBuilder("product_in_cart")
        .delete()
        .where("product_in_cart.userId = :userId", { userId: user.id })
        .where("product_in_cart.id = :id", { id })
        .execute();
    }

    // return ids;
  }
}
