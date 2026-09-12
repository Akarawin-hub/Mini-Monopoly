import { JAIL_BAIL_AMOUNT, TAKEOVER_MULTIPLIER, MAX_PROPERTIES, type Game } from "../game/Game";
import { Player } from "../game/Player";

const MIN_CASH_BUFFER_AFTER_BUY = 150;
const GOOD_RENT_THRESHOLD = 30;
const MIN_CASH_BUFFER_AFTER_BAIL = 300;

export class NormalAI {
    constructor(public readonly player: Player) {
        player.sellPriority = (p) => [...p.properties].sort((a, b) => a.rent - b.rent);
        player.decideJail = (_game, p) => p.money - JAIL_BAIL_AMOUNT >= MIN_CASH_BUFFER_AFTER_BAIL;
    }

    public takeTurn(game: Game): number {
        const dice = game.roll(this.player);
        if (dice === 0) return dice;
        const tile = game.board.getTile(this.player.position);
        if (tile.type !== "property" || !tile.property) return dice;
        if (tile.property.owner?.id === this.player.id) return dice;

        const p = tile.property;
        const goodRent = p.rent >= GOOD_RENT_THRESHOLD;
        const notOverextended = this.player.properties.length < MAX_PROPERTIES;

        if (!p.owner) {
            const affordableBuffer = this.player.money - p.price >= MIN_CASH_BUFFER_AFTER_BUY;
            if (affordableBuffer && goodRent && notOverextended) game.buy(this.player);
        } else {
            const offer = Math.ceil(p.price * TAKEOVER_MULTIPLIER);
            const affordableAfterTakeover = this.player.money - offer >= MIN_CASH_BUFFER_AFTER_BUY;
            if (affordableAfterTakeover && goodRent && notOverextended) {
                game.takeOver(this.player, p.id, offer);
            }
        }
        return dice;
    }
}