import type { Property } from "./Property";
import type { TileType } from "./types";

export class Tile {
  private readonly position: number;
  private readonly type: TileType;
  private readonly property: Property | null;

  constructor(position: number, type: TileType, property: Property | null = null) {
    if (!Number.isInteger(position) || position < 1 || position > 32) {
      throw new Error("Tile position must be between 1 and 32.");
    }

    if (type === "PROPERTY" && property === null) {
      throw new Error("PROPERTY tile must reference a Property.");
    }

    if (type !== "PROPERTY" && property !== null) {
      throw new Error("Only PROPERTY tiles can reference a Property.");
    }

    this.position = position;
    this.type = type;
    this.property = property;
  }

  getPosition(): number {
    return this.position;
  }

  getType(): TileType {
    return this.type;
  }

  getProperty(): Property | null {
    return this.property;
  }
}
