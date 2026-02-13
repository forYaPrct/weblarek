import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events";

export class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.products = products;

    this.events.emit("catalog:change");
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | null {
    return this.products.find((product) => product.id === id) || null;
  }

  selectProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("catalog:preview-change");
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}