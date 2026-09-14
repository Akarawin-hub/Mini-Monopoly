import { Board, type Tile } from "./Board";
import { createChanceDeck, type ChanceCard } from "./Chance";
import { Player } from "./Player";
import type { Property } from "./Property";

export type EventLog = (message: string) => void;
export type ChanceHandler = (player: Player, card: ChanceCard) => void;
export type GameStatus = "playing" | "finished";

export interface RandomSource { (): number; }

export const rollDice = (random: RandomSource = Math.random): number => Math.floor(random() * 6) + 1;

export const movePosition = (position: number, steps: number, boardSize: number): number => ((position + steps) % boardSize + boardSize) % boardSize;

export const JAIL_BAIL_AMOUNT = 50;
export const TAKEOVER_MULTIPLIER = 2.0;

export class Game {
  public readonly board = new Board();
  public readonly players: Player[];
  public readonly chanceDeck: ChanceCard[] = createChanceDeck();
  public currentPlayerIndex = 0;
  public status: GameStatus = "playing";
  public winner: Player | null = null;
  public lastDice = 0;
  
  public pendingProperty: Property | null = null;
  public pendingTakeover: Property | null = null; 
  public pendingDebt = false;
  public onChance: ChanceHandler | null = null;
  private readonly log: EventLog;

  constructor(players: Player[], log: EventLog = () => {}) {
    if (players.length !== 4) throw new Error("Game requires exactly 4 players.");
    this.players = players;
    this.log = log;
  }

  public get currentPlayer(): Player { return this.players[this.currentPlayerIndex]!; }
  public get activePlayers(): Player[] { return this.players.filter(p => p.status !== "bankrupt"); }

  public roll(player: Player = this.currentPlayer): number {
    if (this.status === "finished") return 0;
    if (player.status === "bankrupt") return 0;

    if (player.status === "jailed") {
      const wantsBail = player.decideJail?.(this, player) ?? false;
      if (wantsBail && player.money >= JAIL_BAIL_AMOUNT) {
        player.removeMoney(JAIL_BAIL_AMOUNT);
        player.status = "active";
        this.log(`${player.name} paid $${JAIL_BAIL_AMOUNT} bail and left Jail immediately.`);
      } else {
        player.status = "active";
        this.log(`${player.name} leaves Jail.`);
        this.nextTurn();
        return 0;
      }
    }

    const dice = rollDice();
    this.lastDice = dice;
    const old = player.position;
    const next = movePosition(old, dice, this.board.tiles.length);
    if (next < old && next !== 0) {
      player.addMoney(200);
      this.log(`${player.name} passed START and collected $200.`);
    }
    player.position = next;
    this.log(`${player.name} rolled ${dice} and moved to ${this.board.getTile(next).name}.`);
    const tile = this.board.getTile(next);
    this.resolveTile(player, tile);

    if (this.pendingDebt) {
      return dice;
    }

    this.checkBankruptcy(player);
    this.checkWinner();

    const awaitingHumanDecision =
      player.id === "human" &&
      this.status === "playing" &&
      tile.type === "property" &&
      !!tile.property &&
      !tile.property.owner;

    if (awaitingHumanDecision) {
      this.pendingProperty = tile.property!;
    } else {
      this.pendingProperty = null;
      if (this.status === "playing") this.nextTurn();
    }
    return dice;
  }

  public decidePurchase(buy: boolean): void {
    if (!this.pendingProperty) return;
    if (buy) this.buy(this.currentPlayer);
    this.pendingProperty = null;
    if (this.status === "playing") this.nextTurn();
  }

  public resolveTile(player: Player, tile: Tile): void {
    switch (tile.type) {
      case "start":
        player.addMoney(200);
        this.log(`${player.name} landed on START and received $200.`);
        break;
      case "tax":
        this.pay(player, tile.amount ?? 100, "tax");
        break;
      case "jail":
      case "goToJail":
        player.status = "jailed";
        this.log(`${player.name} is sent to Jail.`);
        break;
      case "parking":
        this.log(`${player.name} is safe at ${tile.name}.`);
        break;
      case "chance":
        this.drawChance(player);
        break;
      case "property":
        this.resolveProperty(player, tile.property!);
        break;
    }
  }

  public buy(player: Player): boolean {
    const tile = this.board.getTile(player.position);
    if (tile.type !== "property" || !tile.property || tile.property.owner) return false;
    const property = tile.property;
    if (player.money < property.price) return false;
    player.removeMoney(property.price);
    property.owner = { id: player.id, name: player.name };
    player.addProperty(property);
    this.log(`${player.name} bought ${property.name} for $${property.price}.`);
    return true;
  }

  public sellProperty(player: Player, propertyId: number): boolean {
    const property = player.properties.find(p => p.id === propertyId);
    if (!property) return false;
    player.removeProperty(property);
    property.owner = null;
    const sellPrice = Math.floor(property.price * 0.5);
    player.addMoney(sellPrice);
    this.log(`${player.name} sold ${property.name} for $${sellPrice}.`);
    return true;
  }

  public takeOver(buyer: Player, propertyId: number, offer: number): boolean {
    const property = this.board.findPropertyById(propertyId);
    if (!property || !property.owner) return false;
    if (property.owner.id === buyer.id) return false;
    if (offer < property.price * TAKEOVER_MULTIPLIER) return false;
    if (buyer.money < offer) return false;

    const seller = this.players.find(p => p.id === property.owner!.id);
    if (!seller) return false;

    buyer.removeMoney(offer);
    seller.addMoney(offer);
    seller.removeProperty(property);
    property.owner = { id: buyer.id, name: buyer.name };
    buyer.addProperty(property);
    this.log(`? ${buyer.name} took over ${property.name} from ${seller.name} for $${offer}!`);
    return true;
  }

  public initiateTakeover(propertyId: number): boolean {
    const property = this.board.findPropertyById(propertyId);
    if (!property || !property.owner || property.owner.id === "human") return false;
    const human = this.players.find(p => p.id === "human");
    if (!human) return false;
    const minOffer = Math.ceil(property.price * TAKEOVER_MULTIPLIER);
    if (human.money < minOffer) return false;
    this.pendingTakeover = property;
    return true;
  }

  public decideTakeover(confirm: boolean): void {
    if (!this.pendingTakeover) return;
    if (confirm) {
      const human = this.players.find(p => p.id === "human")!;
      const offer = Math.ceil(this.pendingTakeover.price * TAKEOVER_MULTIPLIER);
      this.takeOver(human, this.pendingTakeover.id, offer);
    }
    this.pendingTakeover = null;
  }

  public nextTurn(): void {
    if (this.status === "finished") return;
    let next = this.currentPlayerIndex;
    do {
      next = (next + 1) % this.players.length;
    } while (this.players[next]!.status === "bankrupt");
    this.currentPlayerIndex = next;
  }

  public checkWinner(): Player | null {
    const active = this.activePlayers;
    if (active.length === 1) {
      this.status = "finished";
      this.winner = active[0]!;
      this.log(`+ ${this.winner.name} wins the game!`);
    }
    return this.winner;
  }

  private resolveProperty(player: Player, property: NonNullable<Tile["property"]>): void {
    if (!property.owner) {
      this.log(`${property.name} is available for $${property.price}.`);
      return;
    }
    if (property.owner.id === player.id) {
      this.log(`${player.name} landed on their own property.`);
      return;
    }
    const owner = this.players.find(p => p.id === property.owner?.id);
    if (owner) this.payRent(player, owner, property.rent);
  }

  private payRent(player: Player, owner: Player, amount: number): void {
    const paid = Math.max(0, Math.min(amount, player.money));
    player.removeMoney(amount);
    owner.addMoney(paid);
    this.log(`${player.name} paid $${paid} rent to ${owner.name}.`);
    if (player.money < 0) this.handleInsufficientFunds(player);
  }

  private pay(player: Player, amount: number, reason: string): void {
    const paid = Math.max(0, Math.min(amount, player.money));
    player.removeMoney(amount);
    this.log(`${player.name} paid $${paid} ${reason}.`);
    if (player.money < 0) this.handleInsufficientFunds(player);
  }

  private drawChance(player: Player): void {
    const card = this.chanceDeck[Math.floor(Math.random() * this.chanceDeck.length)]!;
    this.log(`- Chance: ${card.description}`);
    this.onChance?.(player, card);
    card.apply(player, {
      move: (p, steps) => { p.position = movePosition(p.position, steps, this.board.tiles.length); },
      payTax: (p, amount) => this.pay(p, amount, "tax"),
    });
  }

  private handleInsufficientFunds(player: Player): void {
    if (player.id === "human" && player.properties.length > 0) {
      this.pendingDebt = true;
      return;
    }
    while (player.money < 0 && player.properties.length > 0) {
      const sellOrder = player.sellPriority?.(player) ?? [...player.properties].sort((a, b) => a.price - b.price);
      const toSell = sellOrder[0] ?? player.properties[0]!;
      this.sellProperty(player, toSell.id);
    }
    this.checkBankruptcy(player);
  }

  public sellForDebt(propertyId: number): boolean {
    if (!this.pendingDebt) return false;
    const player = this.currentPlayer;
    if (!this.sellProperty(player, propertyId)) return false;

    if (player.money >= 0 || player.properties.length === 0) {
      this.pendingDebt = false;
      this.checkBankruptcy(player);
      this.checkWinner();
      if (this.status === "playing") this.nextTurn();
    }
    return true;
  }

  public declareBankruptcy(): void {
    if (!this.pendingDebt) return;
    this.pendingDebt = false;
    this.declareBankrupt(this.currentPlayer);
    this.checkWinner();
    if (this.status === "playing") this.nextTurn();
  }

  private declareBankrupt(player: Player): void {
    for (const property of [...player.properties]) {
      player.removeProperty(property);
      property.owner = null;
    }
    player.money = 0;
    player.status = "bankrupt";
    this.log(`* ${player.name} is BANKRUPT!`);
  }

  private checkBankruptcy(player: Player): void {
    if (player.money < 0) this.declareBankrupt(player);
  }
}