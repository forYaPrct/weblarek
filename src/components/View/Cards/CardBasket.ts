import { ensureElement } from "../../../utils/utils";
import { Card, CardData } from "./Card";

interface CardBasketData extends CardData {
  index: number;
}

export class CardBasket extends Card<CardBasketData> {
  protected itemIndexElement: HTMLElement;
  protected itemdeleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDeleteClick?: () => void) {
    super(container);

    this.itemIndexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.itemdeleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    if (onDeleteClick) {
      this.itemdeleteButton.addEventListener("click", onDeleteClick);
    }
  }

  set index(value: number) {
    this.itemIndexElement.textContent = String(value);
  }
}