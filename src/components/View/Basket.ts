import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface BasketData {
  list: HTMLElement[];
  total: number;
}

export class Basket extends Component<BasketData> {
  protected basketListElement: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected basketPriceElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.basketListElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.basketPriceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.basketButton.disabled = true;

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:place-an-order");
    });
  }

  set list(items: HTMLElement[]) {
    this.basketListElement.replaceChildren(...items);
    if (items.length === 0) this.basketButton.disabled = true;
    else this.basketButton.disabled = false;
  }
  set total(value: number) {
    this.basketPriceElement.textContent = String(value);
  }
}
