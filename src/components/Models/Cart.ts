import { IProduct } from "../../types/index.ts";

export class Cart {
  private cartProducts: IProduct[] = [];

  getCartProducts(): IProduct[] {
    return this.cartProducts;
  }

  addProduct(product: IProduct): void {
    this.cartProducts.push(product);
  }

  removeProduct(product: IProduct): void {
    this.cartProducts = this.cartProducts.filter(
      (item) => item.id !== product.id,
    );
  }

  clear(): void {
    this.cartProducts = [];
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