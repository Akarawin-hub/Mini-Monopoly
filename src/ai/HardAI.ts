import { JAIL_BAIL_AMOUNT, TAKEOVER_MULTIPLIER, type Game } from "../game/Game";
import { Player } from "../game/Player";

const MIN_CASH_RESERVE_AFTER_BUY = 150;
const ROI_THRESHOLD_LEADING = 0;
const ROI_THRESHOLD_BEHIND = -20;
const MIN_CASH_RESERVE_AFTER_BAIL = 100;
const ACTIVE_PORTFOLIO_SIZE = 3;

export class HardAI {
    constructor(public readonly player: Player) {
        player.sellPriority = (p) => [...p.properties].sort((a, b) => (a.rent / a.price) - (b.rent / b.price));
        player.decideJail = (game, p) => {
            if (p.money - JAIL_BAIL_AMOUNT < MIN_CASH_RESERVE_AFTER_BAIL) return false;
            const behind = HardAI.isBehindRichestOpponent(game, p);
            return behind || p.properties.length >= ACTIVE_PORTFOLIO_SIZE;
        };
    }

    public takeTurn(game: Game): number {
        const dice = game.roll(this.player);
        if (dice === 0) return dice;
        const tile = game.board.getTile(this.player.position);
        if (tile.type !== "property" || !tile.property) return dice;
        if (tile.property.owner?.id === this.player.id) return dice;

        const p = tile.property;
        const behind = HardAI.isBehindRichestOpponent(game, this.player);
        const roi = p.rent * 4 - p.price * 0.25;
        const threshold = behind ? ROI_THRESHOLD_BEHIND : ROI_THRESHOLD_LEADING;

        if (!p.owner) {
            const moneyAfter = this.player.money - p.price;
            if (moneyAfter >= MIN_CASH_RESERVE_AFTER_BUY && roi > threshold) game.buy(this.player);
        } else {
            const offer = Math.ceil(p.price * TAKEOVER_MULTIPLIER);
            const moneyAfterTakeover = this.player.money - offer;
            if (moneyAfterTakeover >= MIN_CASH_RESERVE_AFTER_BUY && behind && roi > threshold) {
                game.takeOver(this.player, p.id, offer);
            }
        }
        return dice;
    }

    private static isBehindRichestOpponent(game: Game, player: Player): boolean {
        const opponents = game.players.filter(pl => pl.id !== player.id && pl.status !== "bankrupt");
        const richestOpponent = Math.max(0, ...opponents.map(pl => pl.money));
        return player.money < richestOpponent;
    }
}