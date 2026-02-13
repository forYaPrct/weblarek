import { Component } from "../base/Component";

export interface GalleryData {
  catalog: HTMLElement[];
}

export class Gallery extends Component<GalleryData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set catalog(items: HTMLElement[]) {
    if (items) this.container.replaceChildren(...items);
  }
}