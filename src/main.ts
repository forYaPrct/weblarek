import "./scss/styles.scss";

import { Buyer } from "./components/Models/Buyer";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";

import { Api } from "./components/base/Api";
import { LarekApi } from "./components/communication/LarekApi";
import { API_URL } from "./utils/constants";

import { EventEmitter } from "./components/base/Events";
import { ensureElement, cloneTemplate } from "./utils/utils";

import {
  IApi,
  IProduct,
  IBuyer,
  ICatalogResponse,
  IOrder,
  IOrderResponse,
  TPayment,
} from "./types";

import { CardBasket } from "./components/View/Cards/CardBasket";
import {
  CardCatalog,
  CardCatalogData,
} from "./components/View/Cards/CardCatalog";
import {
  CardPreview,
  CardPreviewData,
} from "./components/View/Cards/CardPrewiev";
import { FormContacts } from "./components/View/Forms/FormContacts";
import { FormOrder } from "./components/View/Forms/FormOrder";
import { Basket } from "./components/View/Basket";
import { Gallery } from "./components/View/Gallery";
import { Header } from "./components/View/Header";
import { Modal } from "./components/View/Modal";
import { Success } from "./components/View/Success";

const events = new EventEmitter();

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const catalog = new Catalog(events);
const buyer = new Buyer(events);
const cart = new Cart(events);

const headerContainer = ensureElement<HTMLElement>(".header");
const header = new Header(events, headerContainer);

const galeryContainer = ensureElement<HTMLElement>(".gallery");
const gallery = new Gallery(galeryContainer);

const modalContainer = ensureElement<HTMLElement>(".modal");
const modal = new Modal(events, modalContainer);

const success = new Success(events, cloneTemplate("#success"));

const cardPreview = new CardPreview(cloneTemplate("#card-preview"), () => {
  events.emit("product:toggle-basket");
});

const basketView = new Basket(events, cloneTemplate("#basket"));

const formOrder = new FormOrder(events, cloneTemplate("#order"));

const formContacts = new FormContacts(events, cloneTemplate("#contacts"));

function FirstErrorText(
  errors: { [K in keyof IBuyer]?: string },
  ...keys: (keyof IBuyer)[]
): string {
  let result = "";
  for (let i = 0; i < keys.length; i++) {
    const error = errors[keys[i]];
    if (error) {
      result = error;
      break;
    }
  }
  return result;
}

events.on("catalog:change", () => {
  const products = catalog.getProducts();

  const cards = products.map((product) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), () => {
      events.emit("card:select", { product });
    });
    const altObj = Object.assign(
      {},
      product as Partial<
        Omit<CardCatalogData, "image"> & { image: { url: string; alt: string } }
      >,
    );
    altObj.image = { url: product.image as string, alt: product.title };
    return card.render(altObj);
  });

  gallery.render({ catalog: cards });
});

events.on("catalog:preview-change", () => {
  const product = catalog.getSelectedProduct();
  if (!product) return;
  const altObj = Object.assign(
    {},
    product as Partial<
      Omit<CardPreviewData, "image"> & { image: { url: string; alt: string } }
    >,
  );
  altObj.buttonText = cart.isInCart(product.id);
  altObj.image = { url: product.image as string, alt: product.title };
  modal.content = cardPreview.render(altObj);
  modal.open();
});

events.on<{ product: IProduct }>("card:select", ({ product }) => {
  catalog.selectProduct(product);
});

events.on("product:toggle-basket", () => {
  const product = catalog.getSelectedProduct();
  if (!product) return;
  if (cart.isInCart(product.id)) {
    cart.removeProduct(product);
  } else {
    if (product.price !== null) cart.addProduct(product);
  }
  modal.close();
});

events.on("basket:open", () => {
  modal.content = basketView.render(basketView);
  modal.open();
});

events.on<{ id: string }>("basket:item-delete", ({ id }) => {
  const item = catalog.getProductById(id);
  if (!item) return;
  cart.removeProduct(item);
});

events.on(
  "cart:change",
  ({
    items,
    total,
    count,
  }: {
    items: IProduct[];
    total: number;
    count: number;
  }) => {
    header.render({ counter: count });
    const elementItems = items.map((item, index) => {
      const line = new CardBasket(cloneTemplate("#card-basket"), () => {
        events.emit("basket:item-delete", { id: item.id });
      });
      line.index = index + 1;
      return line.render(item);
    });
    basketView.list = elementItems;
    basketView.total = total;
  },
);

events.on("buyer:change", ({ payment, email, phone, address }: IBuyer) => {
  if (payment !== formOrder.paymentType) formOrder.paymentType = payment;
  if (address !== formOrder.address) formOrder.address = address;
  if (email !== formContacts.email) formContacts.email = email;
  if (phone !== formContacts.phone) formContacts.phone = phone;
});

events.on("basket:place-an-order", () => {
  modal.content = formOrder.render(formOrder);
  modal.open();
});

events.on(
  "form:change",
  ({ field, value }: { field: string; value: string }) => {
    if (field === "payment") {
      formOrder.paymentType = value as TPayment;
      buyer.setPayment(value as TPayment);
    }
    if (field === "address") {
      buyer.setAddress(value);
    }
    if (field === "email") {
      buyer.setEmail(value);
    }
    if (field === "phone") {
      buyer.setPhone(value);
    }
    formOrder.errors = FirstErrorText(buyer.validate(), "payment", "address");
    formContacts.errors = FirstErrorText(buyer.validate(), "email", "phone");
  },
);

events.on("formOrder:submit", () => {
  modal.content = formContacts.render(formContacts);
  modal.open();
});

events.on("formContacts:submit", () => {
  const buyerInfo = buyer.getBuyerInfo();
  const orderInfo: IOrder = {
    payment: buyerInfo.payment,
    email: buyerInfo.email,
    phone: buyerInfo.phone,
    address: buyerInfo.address,
    total: cart.getTotalPrice(),
    items: cart.getCartProducts().map((item) => item.id)
  }

  larekApi
  .postOrder(orderInfo)
  .then((res) => {
    success.totalAmount = res.total;
    console.log(res);
    modal.content = success.render(success);
    modal.open();
    buyer.clearBuyerInfo();
    cart.clear();
  })
  .catch((err) => console.error(err));
})

events.on("success:close", () => {
  modal.close();
});

larekApi
  .getCatalog()
  .then((res) => {
    catalog.setProducts(res);
  })
  .catch((err) => console.error(err));