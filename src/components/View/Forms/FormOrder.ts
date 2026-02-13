import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, FormData } from "./Form";
import { TPayment } from "../../../types/index";

export interface FormOrderData extends FormData {
  paymentType: TPayment;
  address: string;
}

export class FormOrder extends Form<FormOrderData> {
  protected onlineButton: HTMLButtonElement;
  protected onDeliveryButton: HTMLButtonElement;
  protected addressInputElement: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLFormElement,
  ) {
    super(container);

    this.onlineButton = ensureElement<HTMLButtonElement>(
      ".button[name='card']",
      this.container,
    );
    this.onDeliveryButton = ensureElement<HTMLButtonElement>(
      ".button[name='cash']",
      this.container,
    );
    this.addressInputElement = ensureElement<HTMLInputElement>(
      ".form__input[name='address']",
      this.container,
    );

    this.submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.events.emit("formOrder:submit");
    });

    this.onlineButton.addEventListener("click", () => {
      this.events.emit("form:change", {
        field: "payment",
        value: "card",
      });
    });

    this.onDeliveryButton.addEventListener("click", () => {
      this.events.emit("form:change", {
        field: "payment",
        value: "cash",
      });
    });

    this.addressInputElement.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit("form:change", {
        field: "address",
        value: target.value,
      });
    });
  }

  set paymentType(value: TPayment) {
    this.onlineButton.classList.toggle("button_alt-active", value === "card");
    this.onDeliveryButton.classList.toggle(
      "button_alt-active",
      value === "cash",
    );
  }

  set address(value: string) {
    this.addressInputElement.value = value;
  }
}