import { ensureElement } from "../../../utils/utils";
import { Card, CardData } from "./Card";
import { categoryMap } from "../../../utils/constants";
import { CDN_URL } from "../../../utils/constants";

export interface CardCatalogData extends CardData {
  category: string;
  image: { url: string; alt: string };
}

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<CardCatalogData> {
  protected categoryElement: HTMLElement;
  protected imgElement: HTMLImageElement;

  constructor(container: HTMLButtonElement, onClick?: () => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imgElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    if (onClick) {
      this.container.addEventListener("click", onClick);
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

  set image(value: { url: string; alt: string }) {
    const url = (CDN_URL + value.url).replace(".svg", ".png");
    this.setImage(this.imgElement, url, value.alt ?? "");
  }
}