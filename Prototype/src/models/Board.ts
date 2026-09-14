import { Property } from "./Property";
import type { PropertyTier, TileType } from "./types";
import { Tile } from "./Tile";
import type { Player } from "./Player";

interface PropertySetting {
  name: string;
  position: number;
  tier: PropertyTier;
  price: number;
  rent: number;
}

const PROPERTY_SETTINGS: PropertySetting[] = [
  { name: "T1-1", position: 2, tier: "T1", price: 500, rent: 500 },
  { name: "T1-2", position: 3, tier: "T1", price: 500, rent: 500 },
  { name: "T1-3", position: 4, tier: "T1", price: 500, rent: 500 },
  { name: "T1-4", position: 5, tier: "T1", price: 500, rent: 500 },
  { name: "T2-1", position: 7, tier: "T2", price: 1_000, rent: 1_000 },
  { name: "T2-2", position: 8, tier: "T2", price: 1_000, rent: 1_000 },
  { name: "T2-3", position: 10, tier: "T2", price: 1_000, rent: 1_000 },
  { name: "T2-4", position: 11, tier: "T2", price: 1_000, rent: 1_000 },
  { name: "T3-1", position: 13, tier: "T3", price: 1_500, rent: 1_500 },
  { name: "T3-2", position: 14, tier: "T3", price: 1_500, rent: 1_500 },
  { name: "T3-3", position: 16, tier: "T3", price: 1_500, rent: 1_500 },
  { name: "T3-4", position: 17, tier: "T3", price: 1_500, rent: 1_500 },
  { name: "T4-1", position: 19, tier: "T4", price: 2_000, rent: 2_000 },
  { name: "T4-2", position: 20, tier: "T4", price: 2_000, rent: 2_000 },
  { name: "T4-3", position: 22, tier: "T4", price: 2_000, rent: 2_000 },
  { name: "T4-4", position: 23, tier: "T4", price: 2_000, rent: 2_000 },
  { name: "T5-1", position: 25, tier: "T5", price: 2_500, rent: 2_500 },
  { name: "T5-2", position: 26, tier: "T5", price: 2_500, rent: 2_500 },
  { name: "T5-3", position: 28, tier: "T5", price: 2_500, rent: 2_500 },
  { name: "T5-4", position: 29, tier: "T5", price: 2_500, rent: 2_500 },
  { name: "T6-1", position: 31, tier: "T6", price: 3_000, rent: 3_000 },
  { name: "T6-2", position: 32, tier: "T6", price: 3_000, rent: 3_000 },
];

const SPECIAL_TILES: Record<number, TileType> = {
  1: "START",
  6: "CHANCE",
  9: "FREE_PARKING",
  12: "JAIL",
  15: "TAX",
  18: "CHANCE",
  21: "FREE_PARKING",
  24: "CHANCE",
  27: "TAX",
  30: "CHANCE",
};

export class Board {
  private readonly tiles: Tile[];
  private readonly size: number;

  constructor() {
    this.size = 32;

    const propertyMap = new Map<number, Property>();
    let propertyId = 1;

    for (const setting of PROPERTY_SETTINGS) {
      propertyMap.set(
        setting.position,
        new Property(
          propertyId++,
          setting.name,
          setting.position,
          setting.tier,
          setting.price,
          setting.rent,
        ),
      );
    }

    this.tiles = [];

    for (let position = 1; position <= this.size; position += 1) {
      const property = propertyMap.get(position);
      const type: TileType = property
        ? "PROPERTY"
        : SPECIAL_TILES[position] ?? "PROPERTY";

      // id = position เพราะแต่ละตำแหน่งมี Tile เดียว ไม่ซ้ำกันอยู่แล้ว
      this.tiles.push(new Tile(position, position, type, property ?? null));
    }
  }

  getTile(position: number): Tile {
    if (!Number.isInteger(position) || position < 1 || position > this.size) {
      throw new Error("Position must be between 1 and 32.");
    }

    return this.tiles[position - 1];
  }

  getNextPosition(position: number, steps: number): number {
    if (!Number.isInteger(position) || position < 1 || position > this.size) {
      throw new Error("Position must be between 1 and 32.");
    }

    if (!Number.isInteger(steps)) {
      throw new Error("Steps must be an integer.");
    }

    const zeroBasedPosition = position - 1;
    const wrapped = ((zeroBasedPosition + steps) % this.size + this.size) % this.size;
    return wrapped + 1;
  }

  movePlayer(player: Player, steps: number): void {
    player.move(steps);
  }
}