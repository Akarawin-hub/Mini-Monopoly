import { Property } from "../Property"
import { AIPlayer } from "./AIPlayer"

export class NormalAI extends AIPlayer {
    constructor(id: number, name: string) {
        super(id, name)
    }
    decidePurchase(property: Property): boolean {
    const moneyAfter = this.money - property.getPrice()

    return moneyAfter >= 0
    }
    decideTakeOver(property: Property): boolean {
    const cost = property.getPrice() * 1.65
    const moneyAfter = this.money - cost

    return moneyAfter >= 0
    }
    decideJail(): "BRIBE" | "SKIP" {
    return "SKIP"
    }
    decideSell(properties: Property[]): Property | null {
    if (properties.length === 0) {
        return null
    }

    return [...properties].sort(
        (a, b) => a.getPrice() - b.getPrice()
    )[0]
    }       
}