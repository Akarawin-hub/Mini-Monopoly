# Game
────────────────────────
- players: Player[]
- board: Board
- currentPlayerIndex: number
- turnNumber: number
- gameState: GameState

────────────────────────
+ startGame(): void
+ startTurn(): void
+ endTurn(): void
+ nextPlayer(): void
+ isGameOver(): boolean
+ getWinner(): Player

# Player
────────────────────────
- id: number
- name: string
- money: number
- position: number
- properties: Property[]
- purchaseCount: number
- isBankrupt: boolean
- inJail: boolean

────────────────────────
+ move(steps: number): void
+ pay(amount: number): boolean
+ receive(amount: number): void
+ buyProperty(property: Property): boolean
+ sellProperty(property: Property): boolean
+ addProperty(property: Property): void
+ removeProperty(property: Property): void

# Board
────────────────────────
- tiles: Tile[]
- size: number

────────────────────────
+ getTile(position: number): Tile
+ movePlayer(player: Player, steps: number): void
+ getNextPosition(position: number, steps: number): number

# Tile
────────────────────────
- position: number
- type: TileType
- property: Property | null

────────────────────────
+ getType(): TileType
+ getProperty(): Property | null

# Property
────────────────────────
- id: number
- name: string
- tier: number
- price: number
- owner: Player | null
- rentPool: number

────────────────────────
+ buy(player: Player): boolean
+ payRent(player: Player): boolean
+ collectRent(): number
+ sell(): void
+ takeOver(player: Player): boolean
T1–T6
ราคา 500–3,000
Rent 100%
Rent Pool
Take Over
Sell

# Dice
────────────────────────
- min: number
- max: number

────────────────────────
+ roll(): number
min = 1
max = 6

# UML relationship
Game ◆── Player
Game ◆── Board
Game ◆── Dice

Board ◆── Tile
Tile ──── Property
Player ── Property





| คน       | Tier       | หัวข้อ UML                | Class / Interface ที่ต้องออกแบบ                               |
| -------- | ---------- | ------------------------- | ------------------------------------------------------------- |
| **บีม** | **Tier 1** | Game Core                 | `Game`, `Player`, `GameState`, `Turn`                         |
| **เหมย** | **Tier 2** | Board & Movement          | `Board`, `Tile`, `Dice`, `Position`                           |
| **พีต้า** | **Tier 3** | Property                  | `Property`, `PropertyTier` + ความสัมพันธ์ `Player ↔ Property` |
| **ภูมิ** | **Tier 4** | Economy                   | `Money`, `Rent`, `RentPool`, `Tax`, `SellProperty`            |
| **ตุ้ย** | **Tier 5** | Special Mechanics         | `Chance`, `Jail`, `TakeOver`                                  |
| **ซัน** | **Tier 6** | AI                        | `AIPlayer`, `EasyAI`, `NormalAI`, `HardAI`                    |
| **ตูน ป้อนข้าว** | **Tier 7** | Failure & Game Resolution | `Payment`, `Bankruptcy`, `GameResult`, `Winner`               |
| **ตูน ป้อนข้าว** | **Tier 8** | Technical / Architecture  | รวมทุก Class + Interface + Persistence + Testing Architecture |
