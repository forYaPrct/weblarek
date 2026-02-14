import { ensureElement } from "../../../utils/utils";
import { Card, CardData } from "./Card";
import { categoryMap } from "../../../utils/constants";
import { CDN_URL } from "../../../utils/constants";

export interface CardPreviewData extends CardData {
  category: string;
  image: { url: string; alt: string };
  description: string;
  buttonText: string;
}

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<CardPreviewData> {
  protected categoryElement: HTMLElement;
  protected imgElement: HTMLImageElement;
  protected basketToggleButton: HTMLButtonElement;
  protected descriptionElement: HTMLElement;

  constructor(container: HTMLElement, onBasketClick?: () => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imgElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.basketToggleButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    if (onBasketClick) {
      this.basketToggleButton.addEventListener("click", onBasketClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = "Бесценно";
      this.basketToggleButton.disabled = true;
    } else {
      this.priceElement.textContent = `${value} синапсов`;
      this.basketToggleButton.disabled = false;
    }
  }

  set image(value: { url: string; alt: string }) {
    const url = (CDN_URL + value.url).replace(".svg", ".png");
    this.setImage(this.imgElement, url, value.alt ?? "");
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.basketToggleButton.textContent = value;
  }
}