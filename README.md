# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Товар

```
interface IProduct {
  id: string; - уникальный идентификатор товара
  title: string; - название товара
  image: string; - URL изображения
  category: string; - название категории товара
  price: number | null; - цена товара
  description: string; - описание товара
}
```

#### Покупатель

```
type TPayment = 'card' | 'cash' | '';

interface IBuyer {
  payment: TPayment; - способ оплаты
  email: string; - email покупателя
  phone: string; - номер телефона покупателя
  address: string; - адрес доставки
} 
```

#### Заказ

```
interface IOrder extends IBuyer {
    total: number; - общая стоимость заказа
    items: string[]; - массив id товаров
}
```

#### Ответ сервера на заказ

```
interface IOrderResponse {
    id: string; - id заказа
    total: number; - общая стоимость заказа
}
```

#### Ответ сервера на запрос товаров

```
interface ICatalogResponse {
    total: number; - общее количество товаров
    items: IProduct[]; - массив товаров
}
```

### Модели данных

#### Класс Catalog

Хранит информацию о товарах, и товаре для подробного отображения.

Конструктор:  
`constructor(protected events: IEvents)` - принимает брокер событий.

Поля класса:  
`products: IProduct[]` - массив всех товаров   
`selectedProduct: IProduct | null` - товар для подробного отображения.

Методы:  
`setProducts(products: IProduct[]): void` - сохраняет массив товаров полученный в параметрах.  
`getProducts(): IProduct[]` - возвращает массив товаров products.    
`getProductById(id: string): IProduct | null` - возвращает объект товара по его id.  
`selectProduct(product: IProduct): void` - сохранение товара для подробного отображения.  
`getSelectedProduct(): IProduct` - возвращает товар сохраненный для подробного отображения.

#### Класс Cart

Хранит информацию о товарах, выбранных для покупки.

Конструктор:  
`constructor(protected events: IEvents)` - принимает брокер событий.

Поля класса:  
`cartProducts: IProduct[] | []` - массив выбранных для покупки товаров. 

Методы:  
`getCartProducts(): IProduct[]` - возвращает массив товаров, которые находятся в корзине.  
`addProduct(product: IProduct): void` - добавляет товар, который был получен в параметре, в массив корзины.  
`removeProduct(product: IProduct): void` - удаляет товар, полученный в параметре из массива корзины.  
`clear(): void` - удаляет все товары из корзины.  
`getTotalPrice(): number` - возвращает общую стоимость товаров в корзине.  
`getTotalCount(): number` - возвращает общее количество товаров в корзине.  
`isInCart(id: string): boolean` - проверяет наличие товара в корзине по его id.

#### Класс Buyer

Хранит информацию о покупателе.

Конструктор:  
`constructor(protected events: IEvents)` - принимает брокер событий.

Поля класса:  
`payment: TPayment` - вид оплаты.  
`email: string` - email.  
`phone: string` - номер телефона.  
`address: string` - адреc доставки.  

Методы:  
`setPayment(payment: TPayment): void` - сохраняет способ оплаты.  
`setEmail(email: string): void` - сохраняет email.  
`setPhone(phone: string): void` - сохраняет номер телефона.  
`setAddress(address: string): void` - сохраняет адрес доставки.  
`getBuyerInfo(): IBuyer` - возвращает данные покупателя.  
`clearBuyerInfo(): void` - очищает данные покупателя.  
`validate(): {[K in keyof IBuyer]?: string}` - проверка правильности введенных данных.

### Слой коммуникации

#### Класс LarekApi

Выполняет запрос на сервер с помощью метода get класса Api и получает с сервера объект с массивом товаров.

Конструктор:  
`constructor(api: IApi)` - принимает в качестве параметра объект реализующий интерфейс IApi.

Поля класса:  
`api: IApi` - хранит Api клиента.

Методы:  
`apiGet(): Promise<IProduct[]>` - получает массив товаров с сервера.  
`apiPost(email: IOrder): IOrderResponse` - отправляет данные о заказе на сервер.  

### Слой представления(View)

#### Класс Header

Наследуется от базового класса Component.
Отвечает за шапку сайта, обрабатывает нажатие кнопки "Корзина" и изменение количества товаров в корзине.  

Конструктор:  
`constructor(protected events: IEvents, container: HTMLElement)` - принимает брокер событий и элемент содержащий элементы шапки.  

Поля класса:  
`basketButton: HTMLButtonElement` - элемент кнопки "Корзина".  
`counterElement: HTMLElement` - элемент счётчика товаров.  

Методы:  
`set counter(count: number): void` - устанавливает количество товаров в корзине.  

##### Интерфейс HeaderData

```
interface HeaderData {
    counter: number
};
```

#### Класс Gallery

Наследуется от базового класса Component.
Отвечает за галерею товаров, заменяет дочерние элементы галереи на массив карточек товаров.  

Конструктор:  
`constructor(container: HTMLElement)` - принимает элемент для вывода карточек товаров.  

Методы:  
`set catalog(items: HTMLElement[]): void` - устанавливает массив карточек в каталог.  

##### интерфейс GalleyData

```
interface GalleryData {
    catalog: HTMLElement[]
};
```

#### Класс Modal

Наследуется от базового класса Component.
Отвечает за отображение и установку содержимого модального окна, обрабатывает нажатие на кнопку "Закрыть".

Конструктор:  
`constructor(protected events: IEvents, container: HTMLElement)` - принимает брокер событий и контейнер содержащий элементы модального окна.

Поля класса:  
`modalCloseButton: HTMLButtonElement` - элемент кнопки "Закрыть" модального окна.  
`modalContentElement: HTMLElement` - элемент для содержимого модального окна.  

Методы:  
`set content(item: HTMLElement): void` - устанавливает содержимое модального окна.  
`open(): void` - открывает модальное окно.  
`close(): void` - закрывает модальное окно.  

##### интерфейс ModalData

```
interface  ModalData {
    content: HTMLElement
};
```

#### Класс Success

Наследуется от базового класса Component.
Отвечает за отображение информации об успешном оформлении заказа, списанной сумме и обработке нажатия на кнопку.

Конструктор:  
`constructor(protected events: IEvents, container: HTMLElement)` - принимает брокер событий и контейнер содержащий элемент успешной обработки заказа.  

Поля класса:  
`orderSuccessButton: HTMLButtonElement` - элемент кнопки "За новыми покупками!" модального окна.  
`totalAmountElement: HTMLElement` - элемент для отображения количества списанных синапсов.  

Методы:  
`set totalAmount(value: number): void` - устанавливает текст строки о списаных синапсах.  

##### интерфейс SuccessData

```
interface  SuccessData {
    totalAmount: number
};
```

#### Классы Карточек

##### Класс Card

Наследуется от базового класса Component.
Отвечает за общие элементы для карточек, заменяет данные в полях названия и цены.  

Конструктор:  
`constructor(container: HTMLElement)` - принимает контейнер с элементами карточки товара.  

Поля класса:  
`titleElement: HTMLElement` - элемент для вывода названия товара.  
`priceElement: HTMLElement` - элемент для вывода цены товара.  

Методы:  
`set title(value: string): void` - устанавливает название товара в карточке.  
`set price(value: number | null): void` - устанавливает цену товара в карточке, если значение "null" отображает "Бесценно".  

###### интерфейс CardData

```
interface CardData {
    title: string,
    price: number | null
};
```

##### Класс CardCatalog

Наследуется от класса Card.
Отвечает за отображение карточки в каталоге, добавляет отображение категории и изображения, и обработку клика по карточке.  

Конструктор:  
`constructor(container: HTMLElement, onClick?: () => void)` - принимает контейнер(кнопку) с элементами карточки товара в каталоге и опциональный коллбэк для обработки клика по карточке.  

Поля класса:  
`categoryElement: HTMLElement` - элемент для отображения категории.  
`imgElement: HTMLImageElement` - элемент для изображения товара.  

Методы:  
`set category(value: string): void` - устанавливает категорию товара в карточке и добавляет соответствующий класс из categoryMap.  
`set image(value: string): void` - устанавливает атрибуты src для изображения.  

###### интерфейс CardCatalogData

```
interface CardCatalogData extends CardData {
    category: string
    image: string | { url: string, alt: string },
};
```

##### Класс CardPreview

Наследуется от класса Card.
Отвечает за подробное отображение карточки товара, добавляет отображение категории, изображения, подробного описания, и обработку клика по кнопке добавления(удаления) товара в(из) корзину(ы).  

Конструктор:  
`constructor(container: HTMLElement, onBasketClick?: () => void)` - принимает контейнер с элементами подробного отображения карточки товара и опциональный коллбэк для обработки клика по кнопке корзины.  

Поля класса:  
`categoryElement: HTMLElement` - элемент для отображения категории.  
`imgElement: HTMLImageElement` - элемент для изображения товара.  
`basketToggleButton: HTMLButtonElement` - элемент кнопки добавления(удаления) товара в(из) корзину(ы).  
`descriptionElement: HTMLElement` - элемент для отображения подробного описания.  

Методы:  
`set category(value: string): void` - устанавливает категорию товара в карточке и добавляет соответствующий класс из categoryMap.  
`set image(value: string): void` - устанавливает атрибуты src для изображения.  
`set description(value: string): void` - устанавливает текст подробного описания товара.  
`set buttonText(value: boolean): void` - устанавливает текст на кнопке добавления(удаления) товара в(из) корзину(ы).  

###### интерфейс CardPreviewData

```
interface CardPreviewData extends CardData {
    category: string,
    image: string,
    description: string
};
```

##### Класс CardBasket

Наследуется от класса Card.
Отвечает за отображение карточки товара в корзине, добавляет отображение индекса и обработку клика на кнопкку удаления товара из корзины.  

Конструктор:  
`constructor(container: HTMLElement, onDeleteClick?: () => void)` - принимает контейнер с элементами карточки товара в корзине и опциональный коллбэк для обработки клика по кнопке удалить товар.  

Поля класса:  
`itemIndexElement: HTMLElement` - элемент для отображения порядкового номера товара в корзине.  
`itemdeleteButton: HTMLButtonElement` - элемент кнопки удаления товара из корзины.  

Методы:  
`set index(value: number): void` - устанавливает порядковый номер товара в корзине.  

###### интерфейс CardBasketData

```
interface CardBasketData extends CardData {
    index: number
};
```

#### Класс Basket

Наследуется от базового класса Component.
Отвечает за отображение и установку списка товаров в корзине, обрабатывает нажатие на кнопку "Оформить".  

Конструктор:  
`constructor(protected events: IEvents, container: HTMLElement)` - принимает брокер событий и контейнер содержащий элементы корзины.  

Поля класса:  
`basketListElement: HTMLElement` - элемент отображения списка товаров в корзине.  
`basketButton: HTMLButtonElement` - кнопка оформления заказа.  
`basketPriceElement: HTMLElement` - элемент отображения общей стоимости товаров в корзине.  

Методы:  
`set list(items: HTMLElement[]): void` - устанавливает содержимое модального окна.  
`set total(value: number): void` - устанавливает общую стоимость товаров в корзине.  

##### интерфейс BasketData

```
interface  BasketData {
    list: HTMLElement[],
    total: number
};
```

#### Классы Форм

##### Класс Form

Наследуется от базового класса Component.
Отвечает за общие элементы форм отвечает за вывод ошибок в форме, за блокировку кнопки отправки формы и обработку клика на неё.  

Конструктор:  
`constructor(container: HTMLElement)` - принимает контейнер с элементами форм.  

Поля класса:  
`submitButton: HTMLButtonElement` - кнопка отправки формы.  
`errorsElement: HTMLElement` - элемент для вывода ошибок при заполнении формы.  

Методы:  
`set errors(value: string): void` - устанавливает текст ошибок при заполнении формы.  

###### интерфейс FormData

```
interface FormData {
    errors: string,
};
```

##### Класс FormOrder

Наследуется от класса Form.
Отвечает за отображение формы оформления заказа, добавляет обработку кликов на кнопки способов оплаты, и элемент поля ввода адреса.  

Конструктор:  
`constructor(protected events: IEvents, container: HTMLElement)` - принимает брокер событий и контейнер с элементами формы оформления заказа.  

Поля класса:  
`onlineButton: HTMLButtonElement` - кнопка оплаты онлайн.  
`onDeliveryButton: HTMLButtonElement` - кнопка оплаты при получении.  
`addressInputElement: HTMLInputElement` - элемент ввода адреса доставки.  

Методы:  
`set paymentType(value: TPayment): void` - устанавливает способ оплаты.  
`set address(value: string): void` - устанавливает адрес доставки.  

###### интерфейс FormOrderData

```
interface FormOrderData extends FormData {
  paymentType: TPayment;
  address: string;
}
```

##### Класс FormContacts

Наследуется от класса Form.
Отвечает за отображение формы заполнения контактных данных, добавляет элементы полей ввода email и номера телефона.  

Конструктор:  
`constructor(protected events: IEvents, container: HTMLElement)` - принимает брокер событий и контейнер с элементами формы ввода контактных данных.  

Поля класса:  
`emailInputElement: HTMLInputElement` - элемент ввода email.  
`phoneInputElement: HTMLInputElement` - элемент ввода номера телефона.  

Методы:  
`set email(value: string): void` - устанавливает email.  
`set phone(value: string): void` - устанавливает номер телефона.  

###### интерфейс FormContactsData

```
export interface FormOrderData extends FormData {
  paymentType: TPayment;
  address: string;
}
```

### События

#### События моделей

`catalog:change` - обновлен каталог товаров.  
`catalog:preview-change` - изменение выбранного для просмотра товара.  
`cart:change` - изменение содержимого корзины.  
`buyer:change` - изменение данных покупателя.  

#### События представлений

`basket:item-delete` - нажатие кнопки удаления товара из корзины.  
`card:select` - выбор карточки для просмотра.  
`basket:open` - нажатие кнопки открытия корзины.  
`product:toggle-basket` - нажатие кнопки покупки товара.  
`basket:place-an-order` - нажатие кнопки оформления заказа.  
`formOrder:submit` - нажатие кнопки перехода ко второй форме оформления заказа.  
`formContacts:submit` - нажатие кнопки оплаты.  
`success:close` - нажатие кнопки завершения оформления заказа.  
`form:change` - изменение данных в формах.  