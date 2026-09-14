import { Player } from "../Player";
import type { Property } from "../Property";
import { Bankruptcy } from "./Bankruptcy";

interface SellDecider {
    decideSell(properties: Property[]): Property | null;
}

function canDecideSell(player: Player): player is Player & SellDecider {
    return typeof (player as unknown as SellDecider).decideSell === "function";
}

export class Payment {
    private readonly bankruptcy: Bankruptcy;

    constructor(bankruptcy: Bankruptcy = new Bankruptcy()) {
        this.bankruptcy = bankruptcy;
    }

    processPayment(player: Player, amount: number): boolean {
        if (player.pay(amount)) {
            return true;
        }
        this.raiseFunds(player, amount);

        if (player.pay(amount)) {
            return true;
        }

        this.bankruptcy.declareBankrupt(player);
        return false;
    }

    private raiseFunds(player: Player, amount: number): void {
        if (!canDecideSell(player)) {
            return;
        }

        let remainingProperties = [...player.getProperties()];
        while (player.getMoney() < amount && remainingProperties.length > 0) {
            const propertyToSell = player.decideSell(remainingProperties);
            if (!propertyToSell) {
                break;
            }

            const sold = player.sellProperty(propertyToSell);
            remainingProperties = remainingProperties.filter((property) => property !== propertyToSell,);
            if (!sold) {
                continue;
            }
        }
    }
}