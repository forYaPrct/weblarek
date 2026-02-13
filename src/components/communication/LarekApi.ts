import {
  IApi,
  IOrder,
  IOrderResponse,
  IProduct,
  ICatalogResponse,
} from "../../types";

export class LarekApi {
  private api: IApi;
  constructor(api: IApi) {
    this.api = api;
  }

  getCatalog(): Promise<IProduct[]> {
    return this.api.get<ICatalogResponse>("/product/").then((res) => res.items);
  }

  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post("/order/", order);
  }
}