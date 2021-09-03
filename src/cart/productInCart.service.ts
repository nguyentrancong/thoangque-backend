import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
  private readonly logger = new Logger(ProductInCartService.name);
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
    // case 1
    // const products = this.getProductsInCartBaseQuery().andWhere(
    //   "product_in_cart.userId = :id",
    //   { id: user.id }
    // );
    // return await products.getMany();

    // case 2
    return await this.productInCartRepository.find({
      where: { user },
      relations: ["product"],
    });
  }

  private getProductsInCartBaseQueryandMap(user: User) {
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
      await this.getProductsInCartBaseQueryandMap(user),
      paginations
    );
  }

  public async getProductInCart(
    id: number,
    user: User
  ): Promise<ProductInCart | undefined> {
    // case 1
    // const products = this.getProductsInCartBaseQuery()
    //   .andWhere("product_in_cart.id = :id", { id })
    //   .leftJoinAndSelect("product_in_cart.user", "user");
    // return await products.getOne();

    // case 2
    return await this.productInCartRepository.findOne(id, {
      where: { user },
      relations: ["product"],
    });
  }

  public async createProductInCart(input: CreateProductInCartDto, user: User) {
    const product = await this.productService.getProduct(input.productId);
    if (!product) {
      throw new NotFoundException([`Not found product id: ${input.productId}`]);
    }

    const getProductInCart = await this.getProductsInCartBaseQuery()
      .andWhere("product_in_cart.userId = :userId", { userId: user.id })
      .andWhere("product_in_cart.productId = :productId", {
        productId: product.id,
      })
      .getMany();

    if (getProductInCart.length > 0) {
      throw new BadRequestException([
        `this product in cart is already. productId: ${input.productId}`,
      ]);
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
    const productInCart = await this.productInCartRepository.findOne(id, {
      where: { user },
    });
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
    const productInCart = await this.productInCartRepository.findOne(id, {
      where: { user },
    });
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

  public async deleteProductsInCart(user: User) {
    return await this.productInCartRepository
      .createQueryBuilder("product_in_cart")
      .delete()
      .where("product_in_cart.userId = :userId", { userId: user.id })
      .execute();
  }
}
