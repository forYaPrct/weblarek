import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface FormData {
  errors: string;
}

export class Form<T extends FormData> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      ".button[type='submit']",
      this.container,
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;

    if (value.trim()) this.submitButton.disabled = true;
    else this.submitButton.disabled = false;
  }
}