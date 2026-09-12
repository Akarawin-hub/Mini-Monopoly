import { Property } from "./Property";
import { BOARD_32 } from "../ui/Board32";
import type { Tile } from "./Types";

export class Board {
    public readonly tiles: Tile[];

    constructor() {
        this.tiles = [];
        for (const def of BOARD_32) {
            let tile: Tile;
            if (def.type === "property") {
                tile = { index: def.index, name: def.name, type: "property", property: new Property(def.index, def.name, def.price, def.rent) };
            } else if (def.type === "tax") {
                tile = { index: def.index, name: def.name, type: "tax", amount: def.rent };
            } else {
                tile = { index: def.index, name: def.name, type: def.type };
            }
            this.tiles.push(tile);
        }
    }

    public getTile(position: number): Tile {
        return this.tiles[position % this.tiles.length]!;
    }

    public findPropertyById(id: number): Property | undefined {
        for (const tile of this.tiles) {
            if (tile.property && tile.property.id === id)
                return tile.property;
        }
        return undefined;
    }
}