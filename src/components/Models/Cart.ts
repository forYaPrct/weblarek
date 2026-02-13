import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events";

export class Cart {
  private cartProducts: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getCartProducts(): IProduct[] {
    return this.cartProducts;
  }

  addProduct(product: IProduct): void {
    this.cartProducts.push(product);

    this.events.emit("cart:change", {
      items: this.cartProducts,
      total: this.getTotalPrice(),
      count: this.getTotalCount(),
    });
  }

  removeProduct(product: IProduct): void {
    this.cartProducts = this.cartProducts.filter(
      (item) => item.id !== product.id,
    );

    this.events.emit("cart:change", {
      items: this.cartProducts,
      total: this.getTotalPrice(),
      count: this.getTotalCount(),
    });
  }

  clear(): void {
    this.cartProducts = [];

    this.events.emit("cart:change", {
      items: this.cartProducts,
      total: this.getTotalPrice(),
      count: this.getTotalCount(),
    });
  }

  getTotalPrice(): number {
    return this.cartProducts.reduce(
      (total, product) => total + (product.price || 0),
      0,
    );
  }

  getTotalCount(): number {
    return this.cartProducts.length;
  }

  isInCart(id: string): boolean {
    return this.cartProducts.some((product) => product.id === id);
  }
}