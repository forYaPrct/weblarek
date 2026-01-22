import "./scss/styles.scss";

import { API_URL } from "./utils/constants";
import { Buyer } from "./components/Models/Buyer";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/communication/LarekApi";

// Создаем экземпляры классов
const catalog = new Catalog();
const buyer = new Buyer();
const cart = new Cart();

// Вызываем методы экземпляров

// Проверяем методы класса Catalog
catalog.setProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", catalog.getProducts());
console.log(
  "Товар с id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9' из каталога: ",
  catalog.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
);
console.log("Товар с id='xxx' из каталога: ", catalog.getProductById("xxx"));
catalog.selectProduct(apiProducts.items[2]);
console.log("Выбранный товар из каталога: ", catalog.getSelectedProduct());
console.log("########################");

// Проверяем методы класса Cart
cart.addProduct(apiProducts.items[0]);
cart.addProduct(apiProducts.items[2]);
cart.addProduct(apiProducts.items[1]);
cart.addProduct(apiProducts.items[3]);
console.log("Товары в корзине: ", cart.getCartProducts());
console.log("Количество товаров в корзине: ", cart.getTotalCount());
console.log("Общая стоимость товаров в корзине: ", cart.getTotalPrice());
console.log(
  "Товар с id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9' в корзине: ",
  cart.isInCart("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
);
console.log(
  "Удаляем товар с id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9' из корзины",
);
cart.removeProduct(
  catalog.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")!,
);
console.log(
  "Товар с id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9' в корзине: ",
  cart.isInCart("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
);
console.log("------Очищаем корзину");
cart.clear();
console.log("Товары в корзине после очистки: ", cart.getCartProducts());
console.log(
  "Количество товаров в корзине после очистки: ",
  cart.getTotalCount(),
);
console.log(
  "Общая стоимость товаров в корзине после очистки: ",
  cart.getTotalPrice(),
);
console.log("########################");

// Проверяем методы класса Buyer
buyer.setAddress("г. Москва, ул. Пушкинская, д. 1");
buyer.setPhone("+7 (123) 456-78-90");
buyer.setEmail("X7Hgq@example.com");
buyer.setPayment("cash");
console.log("Информация о покупателе: ", buyer.getBuyerInfo());
buyer.clearBuyerInfo();
console.log("Информация о покупателе после очистки: ", buyer.getBuyerInfo());
console.log("Валидация информации о покупателе: ", buyer.validate());

// Проверяем методы класса Api
const api = new Api(API_URL);
const larekApi = new LarekApi(api);
console.log("Запрашиваем каталог с помощью Api");

larekApi
  .getCatalog()
  .then((res) => {
    catalog.setProducts(res);
    console.log(
      "Выводим каталог запрошенный с помощью Api",
      catalog.getProducts(),
    );
  })
  .catch((err) => console.error(err));
