import { IBuyer, TPayment } from "../../types/index.ts";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment = "";
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor(protected events: IEvents) {}

  setPayment(payment: TPayment): void {
    this.payment = payment;

    this.events.emit("buyer:change");
  }

  setEmail(email: string): void {
    this.email = email;

    this.events.emit("buyer:change");
  }

  setPhone(phone: string): void {
    this.phone = phone;

    this.events.emit("buyer:change");
  }

  setAddress(address: string): void {
    this.address = address;

    this.events.emit("buyer:change");
  }

  getBuyerInfo(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clearBuyerInfo(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";

    this.events.emit("buyer:change");
  }

  validate(): { [K in keyof IBuyer]?: string } {
    const errors: { [K in keyof IBuyer]?: string } = {};
    if (!this.payment) {
      errors.payment = "Выберете способ оплаты";
    }
    if (!this.email) {
      errors.email = "Введите Email";
    }
    if (!this.phone) {
      errors.phone = "Введите номер телефона";
    }
    if (!this.address) {
      errors.address = "Укажите адрес доставки";
    }
    return errors;
  }
}