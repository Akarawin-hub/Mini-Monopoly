export class Property {
  public owner: PlayerRef | null = null;

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly price: number,
    public readonly rent: number,
  ) {}

  public isOwned(): boolean { return this.owner !== null; }
}

export interface PlayerRef {
  readonly id: string;
  readonly name: string;
}