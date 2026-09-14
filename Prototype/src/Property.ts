import type { Player } from "./Player";
import type { PropertyTier } from "./types";

export class Property {
  private readonly id: number;
  private readonly name: string;
  private readonly position: number;
  private readonly tier: PropertyTier;
  private readonly price: number;
  private readonly rent: number;
  private owner: Player | null;
  private rentPool: number;

  constructor(
    id: number,
    name: string,
    position: number,
    tier: PropertyTier,
    price: number,
    rent: number,
  ) {
    if (!Number.isInteger(id) || id < 1) {
      throw new Error("Property id must be a positive integer.");
    }
    if (!Number.isInteger(position) || position < 1 || position > 32) {
      throw new Error("Property position must be between 1 and 32.");
    }
    if (price < 0 || rent < 0) {
      throw new Error("Property price and rent cannot be negative.");
    }

    this.id = id;
    this.name = name;
    this.position = position;
    this.tier = tier;
    this.price = price;
    this.rent = rent;
    this.owner = null;
    this.rentPool = 0;
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPosition(): number {
    return this.position;
  }

  getTier(): PropertyTier {
    return this.tier;
  }

  getPrice(): number {
    return this.price;
  }

  getRent(): number {
    return this.rent;
  }

  getOwner(): Player | null {
    return this.owner;
  }

  getRentPool(): number {
    return this.rentPool;
  }

  setOwner(player: Player | null): void {
    this.owner = player;
  }

  addRent(amount: number): void {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Rent amount must be a non-negative number.");
    }
    this.rentPool += amount;
  }

  collectRent(): number {
    const collected = this.rentPool;
    this.rentPool = 0;
    return collected;
  }

  clearRentPool(): void {
    this.rentPool = 0;
  }
}
