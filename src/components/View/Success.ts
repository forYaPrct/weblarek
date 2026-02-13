import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface SuccessData {
  totalAmount: number;
}

export class Success extends Component<SuccessData> {
  protected orderSuccessButton: HTMLButtonElement;
  protected totalAmountElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.orderSuccessButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this.totalAmountElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );

    this.orderSuccessButton.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set totalAmount(value: number) {
    this.totalAmountElement.textContent = `Списано ${value} синапсов`;
  }
}