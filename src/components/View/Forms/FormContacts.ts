import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, FormData } from "./Form";

export interface FormContactsData extends FormData {
  email: string;
  phone: string;
}

export class FormContacts extends Form<FormContactsData> {
  protected emailInputElement: HTMLInputElement;
  protected phoneInputElement: HTMLInputElement;

  constructor(
    protected events: IEvents,
    container: HTMLFormElement,
  ) {
    super(container);

    this.emailInputElement = ensureElement<HTMLInputElement>(
      ".form__input[name='email']",
      this.container,
    );
    this.phoneInputElement = ensureElement<HTMLInputElement>(
      ".form__input[name='phone']",
      this.container,
    );

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit("formContacts:submit");
    });

    this.emailInputElement.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit("form:change", {
        field: "email",
        value: target.value,
      });
    });

    this.phoneInputElement.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit("form:change", {
        field: "phone",
        value: target.value,
      });
    });
  }

  set email(value: string) {
    this.emailInputElement.value = value;
  }

  set phone(value: string) {
    this.phoneInputElement.value = value;
  }
}