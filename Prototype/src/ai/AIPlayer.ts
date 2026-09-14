import { Player } from "../Player";
import { Property } from "../Property";

export class AIPlayer extends Player {
    constructor(id: number, name: string) {
        super(id, name)
    }

    decidePurchase(property: Property): boolean {
        return false
    }

    decideTakeOver(property: Property): boolean {
        return false
    }

    decideJail(): "BRIBE" | "SKIP" {
        return "SKIP"
    }

    decideSell(properties: Property[]): Property | null {
        return null
    }
}
// const ai = new AIPlayer(2, "AI")