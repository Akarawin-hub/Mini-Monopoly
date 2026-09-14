import { Property } from "./Property";
import { BOARD_32 } from "../ui/Board32";

export type TileType = "start" | "property" | "tax" | "jail" | "goToJail" | "chance" | "parking";

export interface Tile {
  readonly index: number;
  readonly name: string;
  readonly type: TileType;
  readonly property?: Property;
  readonly amount?: number;
}

export class Board {
  public readonly tiles: Tile[];

  constructor() {

    this.tiles = BOARD_32.map((def): Tile => {
      if (def.type === "property") {
        const property = new Property(def.index, def.name, def.price, def.rent);
        return { index: def.index, name: def.name, type: "property", property };
      }

      if (def.type === "tax") {
        return { index: def.index, name: def.name, type: "tax", amount: def.rent };
      }

      return { index: def.index, name: def.name, type: def.type };
    });
  }

  public getTile(position: number): Tile {
    return this.tiles[position % this.tiles.length]!;
  }

  public findPropertyById(id: number): Property | undefined {
    for (const tile of this.tiles) {
      if (tile.property && tile.property.id === id) return tile.property;
    }
    return undefined;
  }
}