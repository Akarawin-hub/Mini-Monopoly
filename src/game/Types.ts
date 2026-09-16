import type { Player } from "./Player";
import type { Game } from "./Game";
import type { Property } from "./Property";

export type PlayerStatus = "active" | "jailed" | "bankrupt";
export type PlayerKind = "Human" | "AI Easy" | "AI Normal" | "AI Hard";

export type SellPriorityFn = (player: Player) => Property[];
export type JailDecisionFn = (game: Game, player: Player) => boolean;

export interface PlayerRef {
    readonly id: string;
    readonly name: string;
}

export type TileType = "start" | "property" | "tax" | "jail" | "goToJail" | "chance" | "parking";

export interface Tile {
    readonly index: number;
    readonly name: string;
    readonly type: TileType;
    readonly property?: Property;
    readonly amount?: number;
}

export interface TileDef {
    readonly index: number;
    readonly type: TileType;
    readonly name: string;
    readonly rent: number;
    readonly price: number;
    readonly isCorner: boolean;
}

export interface ChanceContext {
    readonly move: (player: Player, steps: number) => void;
    readonly payTax: (player: Player, amount: number) => void;
}

export interface ChanceCard {
    readonly title: string;
    readonly description: string;
    readonly apply: (player: Player, context: ChanceContext) => string;
}

export type EventLog = (message: string) => void;
export type OnChanceFn = (player: Player, card: ChanceCard) => void;
export type GameStatus = "playing" | "finished";

export interface RandomSource {
    (): number;
}

export interface SaveData {
    currentPlayer: string;
    players: unknown[];
    savedAt: string;
}

export interface SavedPlayerData {
    id: string;
    name: string;
    kind: PlayerKind;
    money: number;
    position: number;
    status: PlayerStatus;
    properties: number[];
    purchaseCount: number;
    takeoverCount: number;
}