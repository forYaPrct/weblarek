import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ModalData {
  content: HTMLElement;
}

export class Modal extends Component<ModalData> {
  protected modalCloseButton: HTMLButtonElement;
  protected modalContentElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.modalCloseButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.modalContentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this.modalCloseButton.addEventListener("click", () => this.close());
  }

  set content(item: HTMLElement) {
    if (item) this.modalContentElement.replaceChildren(item);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
  }
}