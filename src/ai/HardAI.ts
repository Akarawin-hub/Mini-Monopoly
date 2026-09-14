import { Property } from "../Property"
import { AIPlayer } from "./AIPlayer"

export class HardAI extends AIPlayer {
    constructor(id: number, name: string) {
        super(id, name)
    }
    decidePurchase(property: Property): boolean {
    const moneyBefore = this.money
    const moneyAfter = moneyBefore - property.getPrice()

    return moneyAfter >= moneyBefore * 0.50
    }
    decideTakeOver(property: Property): boolean {
    const cost = property.getPrice() * 1.65
    const moneyAfter = this.money - cost

    return moneyAfter >= 0
    } 
    decideJail(): "BRIBE" | "SKIP" {
    const moneyBefore = this.money
    const moneyAfter = moneyBefore - 500

    if (moneyAfter > moneyBefore * 0.65) {
        return "BRIBE"
    }

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