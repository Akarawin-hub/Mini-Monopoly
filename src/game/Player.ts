import type { Property } from "./Property";
import type { PlayerStatus, PlayerKind, SellPriorityFn, JailDecisionFn } from "./Types";

export class Player {
    public position = 0;
    public money: number;
    public status: PlayerStatus = "active";
    public readonly properties: Property[] = [];
    public purchaseCount = 0;
    public takeoverCount = 0;

    public sellPriority?: SellPriorityFn;
    public decideJail?: JailDecisionFn;

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly kind: PlayerKind,
        money = 1000,
    ) {
        this.money = money;
    }

    public addMoney(amount: number): void {
        this.money += amount;
    }

    public removeMoney(amount: number): void {
        this.money -= amount;
    }

    public addProperty(property: Property): void {
        if (!this.properties.includes(property))
            this.properties.push(property);
    }
    public removeProperty(property: Property): void {
        const index = this.properties.indexOf(property);
        if (index >= 0)
            this.properties.splice(index, 1);
    }
}