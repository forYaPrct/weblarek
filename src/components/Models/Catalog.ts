import { IProduct } from "../../types/index.ts";

export class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | null {
    return this.products.find((product) => product.id === id) || null;
  }

  selectProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}