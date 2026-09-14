import type { Property } from "./Property";
import type { Game } from "./Game";


export type PlayerStatus = "active" | "jailed" | "bankrupt";
export type PlayerKind = "Human" | "AI Easy" | "AI Normal" | "AI Hard";

export type SellPriorityFn = (player: Player) => Property[];
export type JailDecisionFn = (game: Game, player: Player) => boolean;

export class Player {
  public position = 0;
  public money: number;
  public status: PlayerStatus = "active";
  public readonly properties: Property[] = [];

  public sellPriority?: SellPriorityFn;
  public decideJail?: JailDecisionFn;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly kind: PlayerKind,
    money = 1500,
  ) {
    this.money = money;
  }

  public addMoney(amount: number): void { this.money += amount; }
  public removeMoney(amount: number): void { this.money -= amount; }
  public addProperty(property: Property): void {
    if (!this.properties.includes(property)) this.properties.push(property);
  }
  public removeProperty(property: Property): void {
    const index = this.properties.indexOf(property);
    if (index >= 0) this.properties.splice(index, 1);
  }
}