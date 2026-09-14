import { Property } from "./Property";

const BOARD_SIZE = 32;
const MAX_PROPERTIES_HELD = 5;
const MAX_PURCHASE_COUNT = 7;
const STARTING_MONEY = 1_000;
const SELL_RATE = 0.20;

export class Player {
  private readonly id: number;
  private readonly name: string;
  private isBankrupt: boolean;
  private inJail: boolean;
  private position: number;
  protected money: number;
  protected readonly properties: Property[];
  protected purchaseCount: number;
  

  constructor(id: number, name: string) {
    if (!Number.isInteger(id) || id < 1) {
      throw new Error("Player id must be a positive integer.");
    }
    if (!name.trim()) {
      throw new Error("Player name cannot be empty.");
    }

    this.id = id;
    this.name = name;
    this.money = STARTING_MONEY;
    this.position = 1;
    this.properties = [];
    this.purchaseCount = 0;
    this.isBankrupt = false;
    this.inJail = false;
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getMoney(): number {
    return this.money;
  }

  getPosition(): number {
    return this.position;
  }

  getProperties(): readonly Property[] {
    return this.properties;
  }

  getPurchaseCount(): number {
    return this.purchaseCount;
  }

  getIsBankrupt(): boolean {
    return this.isBankrupt;
  }

  getInJail(): boolean {
    return this.inJail;
  }

  setInJail(value: boolean): void {
    this.inJail = value;
  }

  setBankrupt(value: boolean): void {
    this.isBankrupt = value;
  }

  move(steps: number): void {
    if (!Number.isInteger(steps)) {
      throw new Error("Steps must be an integer.");
    }

    const zeroBasedPosition = this.position - 1;
    const wrapped = ((zeroBasedPosition + steps) % BOARD_SIZE + BOARD_SIZE) % BOARD_SIZE;
    this.position = wrapped + 1;
  }

  pay(amount: number): boolean {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Payment amount must be a non-negative number.");
    }

    if (this.money < amount) {
      return false;
    }

    this.money -= amount;
    return true;
  }

  receive(amount: number): void {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Received amount must be a non-negative number.");
    }

    this.money += amount;
  }

  buyProperty(property: Property): boolean {
    if (this.isBankrupt) {
      return false;
    }

    if (this.properties.length >= MAX_PROPERTIES_HELD) {
      return false;
    }

    if (this.purchaseCount >= MAX_PURCHASE_COUNT) {
      return false;
    }

    if (property.getOwner() !== null) {
      return false;
    }

    if (!this.pay(property.getPrice())) {
      return false;
    }

    this.addProperty(property);
    this.purchaseCount += 1;
    property.setOwner(this);
    return true;
  }

  sellProperty(property: Property): boolean {
    if (this.isBankrupt) {
      return false;
    }

    if (!this.properties.includes(property)) {
      return false;
    }

    const sellValue = property.getPrice() * SELL_RATE;

    this.removeProperty(property);
    property.setOwner(null);
    property.clearRentPool();
    this.receive(sellValue);
    return true;
  }

  addProperty(property: Property): void {
    if (this.properties.includes(property)) {
      return;
    }

    if (this.properties.length >= MAX_PROPERTIES_HELD) {
      throw new Error("Player cannot hold more than 5 properties.");
    }

    this.properties.push(property);
  }

  removeProperty(property: Property): void {
    const index = this.properties.indexOf(property);
    if (index === -1) {
      return;
    }

    this.properties.splice(index, 1);
  }
}
