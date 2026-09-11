import { TAKEOVER_MULTIPLIER, type Game } from "../game/Game";
import { Player } from "../game/Player";

export class EasyAI {
    constructor(public readonly player: Player) {
        player.sellPriority = (p) => [...p.properties].sort((a, b) => a.price - b.price);
        player.decideJail = () => false;
    }

    public takeTurn(game: Game): number {
        const dice = game.roll(this.player);
        if (dice === 0)
            return dice;

        const tile = game.board.getTile(this.player.position);
        if (tile.type !== "property" || !tile.property)
            return dice;

        const property = tile.property;
        if (!property.owner) {
            if (this.player.money >= property.price) {
                game.buy(this.player);
            }
        } else if (property.owner.id !== this.player.id) {
            const offer = Math.ceil(property.price * TAKEOVER_MULTIPLIER);
            if (this.player.money >= offer) {
                game.takeOver(this.player, property.id, offer);
            }
        }

        return dice;
    }
}