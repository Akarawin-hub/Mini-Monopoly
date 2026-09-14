import blessed from "blessed";
import { execSync } from "child_process";
import { Game, movePosition } from "../game/Game";
import type { ChanceCard } from "../game/Chance";
import { Player, type PlayerKind, type PlayerStatus } from "../game/Player";
import { EasyAI } from "../ai/EasyAI";
import { NormalAI } from "../ai/NormalAI";
import { HardAI } from "../ai/HardAI";
import { BoardView } from "./BoardView";
import { PlayerView } from "./PlayerView";
import { GameLog } from "./GameLog";
import { ActionMenu } from "./ActionMenu";
import { DiceView } from "./DiceView";
import { PropertyInfo } from "./PropertyInfo";
import { Property } from "../game/Property";
import { writeSave, readSave, type SaveData } from "../save";

const SAVE_FILE = "save.json";
const MOVE_STEP_DELAY_MS = 200;
const PAUSE_AFTER_DICE_MS = 300;

interface SavedPlayerData {
  id: string;
  name: string;
  kind: PlayerKind;
  money: number;
  position: number;
  status: PlayerStatus;
  properties: number[];
}

export class App {
  private readonly screen: blessed.Widgets.Screen;
  private readonly boardView: BoardView;
  private readonly playerView: PlayerView;
  private readonly gameLog: GameLog;
  private readonly actionMenu: ActionMenu;
  private readonly diceView: DiceView;
  private readonly propertyInfo: PropertyInfo;
  private game!: Game;
  private ais!: (EasyAI | NormalAI | HardAI)[];
  private busy = false;

  constructor() {
    App.resizeConsole(195, 46);
    this.screen = blessed.screen({ smartCSR: true, title: "Mini Monopoly TUI" });
    this.boardView = new BoardView();
    this.playerView = new PlayerView();
    this.gameLog = new GameLog();
    this.actionMenu = new ActionMenu();
    this.diceView = new DiceView();
    this.propertyInfo = new PropertyInfo();

    void this.init();
  }

  private async init(): Promise<void> {
    const save = await readSave(SAVE_FILE).catch(() => null);
    this.showStartMenu(save);
  }

  private static resizeConsole(cols: number, rows: number): void {
    try {
      if (process.platform === "win32") {
        execSync(`mode con: cols=${cols} lines=${rows}`);
      } else {
        process.stdout.write(`\x1b[8;${rows};${cols}t`);
      }
    } catch {

    }
  }

  public run(): void { this.screen.render(); }

  private showStartMenu(save: SaveData | null): void {
    const hasSave = save !== null;

    const contentLines = [
      "",
      "{green-fg}{bold}1{/bold}  New Game{/green-fg}",
    ];
    if (hasSave) {
      const savedAt = new Date(save!.savedAt).toLocaleString("th-TH");
      contentLines.push(`{cyan-fg}{bold}2{/bold}  Resume Game{/cyan-fg}   {white-fg}(${savedAt}){/white-fg}`);
    } else {
      contentLines.push("{gray-fg}2  Resume Game   (no saved game){/gray-fg}");
    }
    contentLines.push("");
    contentLines.push("{red-fg}{bold}Q{/bold} Quit{/red-fg}");

    const box = blessed.box({top: "center", left: "center", width: 54, height: 15, border: { type: "line" }, label: " Mini Monopoly ", tags: true, align: "left" as const, valign: "middle" as const, padding: { left: 3, right: 2, top: 0, bottom: 0 }, style: { border: { fg: "cyan" }, label: { fg: "cyan", bold: true } }, content: contentLines.join("\n")});
    this.screen.append(box);
    this.screen.render();

    const startNewGame = () => {
      this.screen.remove(box);
      this.startGame();
    };
    this.screen.onceKey("1", startNewGame);
    this.screen.onceKey("n", startNewGame);

    if (hasSave) {
      const resumeGame = () => {
        this.screen.remove(box);
        this.loadGame(save!);
      };
      this.screen.onceKey("2", resumeGame);
      this.screen.onceKey("r", resumeGame);
      this.screen.onceKey("c", resumeGame);
    }
    this.screen.key(["q", "C-c", "escape"], () => process.exit(0));
  }

  private loadGame(save: SaveData): void {
    const savedPlayers = save.players as SavedPlayerData[];
    const players = savedPlayers.map(sp => {
      const player = new Player(sp.id, sp.name, sp.kind, sp.money);
      player.position = sp.position;
      player.status = sp.status;
      return player;
    });

    this.game = new Game(players, message => this.gameLog.add(message));
    this.game.onChance = (player, card) => this.showChancePopup(player.name, card);

    const savedIndex = players.findIndex(p => p.id === save.currentPlayer);
    const humanIndex = players.findIndex(p => p.id === "human");
    this.game.currentPlayerIndex = (savedIndex >= 0 && players[savedIndex]!.id === "human") ? savedIndex : humanIndex >= 0 ? humanIndex : 0;

    for (const sp of savedPlayers) {
      const player = players.find(p => p.id === sp.id)!;
      for (const propertyId of sp.properties) {
        const property = this.game.board.findPropertyById(propertyId);
        if (!property) continue;
        property.owner = { id: player.id, name: player.name };
        player.addProperty(property);
      }
    }

    this.ais = [];
    for (const p of players) {
      if (p.id === "human")
        continue;
      if (p.kind === "AI Easy")
        this.ais.push(new EasyAI(p));
      else if (p.kind === "AI Normal")
        this.ais.push(new NormalAI(p));
      else
        this.ais.push(new HardAI(p));
    }

    this.layout();
    this.bindKeys();
    this.render();
    this.screen.render();
  }

  private startGame(): void {
    const players = [
      new Player("human", "Player", "Human"),
      new Player("easy", "Bot ( Easy )", "AI Easy"),
      new Player("normal", "Bot ( Normal )", "AI Normal"),
      new Player("hard", "Bot ( Hard )", "AI Hard"),
    ];

    this.game = new Game(players, message => this.gameLog.add(message));
    this.game.onChance = (player, card) => this.showChancePopup(player.name, card);
    this.ais = [
      new EasyAI(players[1]!),
      new NormalAI(players[2]!),
      new HardAI(players[3]!),
    ];

    this.layout();
    this.bindKeys();
    this.render();
    this.screen.render();
  }

  private layout(): void {
    this.boardView.box.top    = 0;
    this.boardView.box.left   = 0;
    this.boardView.box.width  = "72%";
    this.boardView.box.height = "92%";

    this.playerView.box.top    = 0;
    this.playerView.box.left   = "72%";
    this.playerView.box.width  = "28%";
    this.playerView.box.height = "18%";

    this.propertyInfo.box.top    = "18%";
    this.propertyInfo.box.left   = "72%";
    this.propertyInfo.box.width  = "28%";
    this.propertyInfo.box.height = "20%";

    this.gameLog.box.top    = "38%";
    this.gameLog.box.left   = "72%";
    this.gameLog.box.width  = "28%";
    this.gameLog.box.height = "26%";

    this.diceView.box.top    = "64%";
    this.diceView.box.left   = "72%";
    this.diceView.box.width  = "28%";
    this.diceView.box.height = "36%";

    this.actionMenu.box.top    = "92%";
    this.actionMenu.box.left   = 0;
    this.actionMenu.box.width  = "72%";
    this.actionMenu.box.height = "8%";

    this.screen.append(this.boardView.box);
    this.screen.append(this.playerView.box);
    this.screen.append(this.propertyInfo.box);
    this.screen.append(this.gameLog.box);
    this.screen.append(this.diceView.box);
    this.screen.append(this.actionMenu.box);
  }

  private bindKeys(): void {
    this.screen.key(["q", "C-c", "escape"], () => process.exit(0));
    this.screen.key(["enter", "r"], () => { void this.handleRoll(); });
    this.screen.key(["b"], () => {
      if (!this.busy && this.game.currentPlayer.id === "human" && this.game.status === "playing") {
        this.game.buy(this.game.currentPlayer);
        this.render();
        void this.autoSave();
      }
    });
    this.screen.key(["s"], () => {
      if (!this.busy && this.game.currentPlayer.id === "human" && this.game.status === "playing") {
        this.sellCheapest();
        void this.autoSave();
      }
    });
    this.screen.key(["t"], () => {
      if (this.busy || this.game.currentPlayer.id !== "human" || this.game.status !== "playing") return;
      const tile = this.game.board.getTile(this.game.currentPlayer.position);
      if (tile.type !== "property" || !tile.property || !tile.property.owner || tile.property.owner.id === "human") return;
      if (this.game.initiateTakeover(tile.property.id)) {
        void this.showTakeoverPrompt(this.game.pendingTakeover!).then(() => this.autoSave());
      }
    });
    this.screen.key(["n"], () => {
      if (this.busy) return;
      process.exit(0);
    });
  }

  private async handleRoll(): Promise<void> {
    if (this.busy || this.game.status === "finished") return;
    if (this.game.currentPlayer.id !== "human") return;

    this.busy = true;

    const player = this.game.currentPlayer;
    const fromPos = player.position;

    const dice = this.game.roll();

    await this.diceView.animateRoll(dice || 1, () => this.screen.render());
    if (dice > 0) {
      await new Promise(resolve => setTimeout(resolve, PAUSE_AFTER_DICE_MS));
      await this.animateMovement(player, fromPos, dice);
    }
    this.render();
    await this.autoSave();

    if (this.game.pendingDebt) {
      await this.showDebtPrompt();
      await this.autoSave();
    }

    if (this.game.pendingProperty) {
      await this.showPurchasePrompt(this.game.pendingProperty);
      await this.autoSave();
    }

    while (this.game.status === "playing" && this.game.currentPlayer.id !== "human") {
      const currentAi = this.ais.find(ai => ai.player.id === this.game.currentPlayer.id);
      if (!currentAi || currentAi.player.status === "bankrupt") {
        this.game.nextTurn();
        continue;
      }
      await new Promise(resolve => setTimeout(resolve, 600));

      const aiPlayer = currentAi.player;
      const aiFromPos = aiPlayer.position;

      const aiDice = currentAi.takeTurn(this.game);

      if (typeof aiDice === "number" && aiDice > 0) {
        await this.diceView.animateRoll(aiDice, () => this.screen.render());
        await new Promise(resolve => setTimeout(resolve, PAUSE_AFTER_DICE_MS));
        await this.animateMovement(aiPlayer, aiFromPos, aiDice);
      }
      this.render();
      await this.autoSave();
    }

    this.busy = false;
  }

  private async animateMovement(player: Player, fromPos: number, steps: number): Promise<void> {
    const boardSize = this.game.board.tiles.length;
    for (let step = 1; step <= steps; step++) {
      const intermediatePos = movePosition(fromPos, step, boardSize);
      this.boardView.render(this.game.board, this.game.players, { [player.id]: intermediatePos });
      this.playerView.render(this.game.players, this.game.currentPlayer.id);
      this.screen.render();
      await new Promise(resolve => setTimeout(resolve, MOVE_STEP_DELAY_MS));
    }
  }

  private async autoSave(): Promise<void> {
    await writeSave(SAVE_FILE, this.serialize()).catch(() => {});
  }

  private showDebtPrompt(): Promise<void> {
    return new Promise(resolve => {
      const list = blessed.list({
        top: "center",
        left: "center",
        width: "50%",
        height: "50%",
        border: { type: "line" },
        label: " Not Enough Cash ",
        tags: true,
        keys: true,
        mouse: true,
        style: {
          border: { fg: "red" },
          label: { fg: "red", bold: true },
          selected: { bg: "red", fg: "white", bold: true },
        } as any,
      });

      const refresh = () => {
        const p = this.game.currentPlayer;
        const owed = Math.max(0, -p.money);
        list.setLabel(` You owe $${owed} — sell a property `);
        const items = p.properties.map(prop =>
          `${prop.name}  —  sell for $${Math.floor(prop.price * 0.5)}`
        );
        items.push("{red-fg}{bold}[ Declare Bankruptcy ]{/bold}{/red-fg}");
        list.setItems(items as any);
        this.screen.render();
      };

      this.screen.append(list);
      refresh();
      list.focus();
      this.screen.render();

      list.on("select", (_item: unknown, index: number) => {
        const p = this.game.currentPlayer;
        if (index >= p.properties.length) {
          this.game.declareBankruptcy();
        } else {
          const prop = p.properties[index]!;
          this.game.sellForDebt(prop.id);
        }
        this.render();
        void this.autoSave();

        if (this.game.pendingDebt) {
          refresh();
        } else {
          this.screen.remove(list);
          this.screen.render();
          resolve();
        }
      });
    });
  }

  private showPurchasePrompt(property: Property): Promise<void> {
    return new Promise(resolve => {
      const box = blessed.box({
        top: "center",
        left: "center",
        width: "40%",
        height: "30%",
        border: { type: "line" },
        label: " Buy Property? ",
        tags: true,
        align: "center" as const,
        valign: "middle" as const,
        style: { border: { fg: "yellow" }, label: { fg: "yellow", bold: true } },
        content: [
          `{bold}Property: ${property.name}{/bold}`,
          `Price: $${property.price}`,
          `Rent: $${property.rent}`,
          "",
          "{green-fg}{bold}[B]{/bold}{/green-fg} Buy    {red-fg}{bold}[N]{/bold}{/red-fg} Skip",
        ].join("\n"),
      });
      this.screen.append(box);
      this.screen.render();

      const finish = (buy: boolean) => {
        this.game.decidePurchase(buy);
        this.screen.remove(box);
        this.render();
        this.screen.render();
        resolve();
      };

      this.screen.onceKey("b", () => finish(true));
      this.screen.onceKey("n", () => finish(false));
    });
  }

  private showTakeoverPrompt(property: import("../game/Property").Property): Promise<void> {
    return new Promise(resolve => {
      const offer = Math.ceil(property.price * 2.0);
      const box = blessed.box({
        top: "center",
        left: "center",
        width: "44%",
        height: "32%",
        border: { type: "line" },
        label: " Take Over? ",
        tags: true,
        align: "center" as const,
        valign: "middle" as const,
        style: { border: { fg: "magenta" }, label: { fg: "magenta", bold: true } },
        content: [
          `{bold}Property: ${property.name}{/bold}`,
          `Current owner: ${property.owner!.name}`,
          `Original price: $${property.price}`,
          `Rent: $${property.rent}`,
          "",
          `{magenta-fg}{bold}Offer: $${offer} (200%){/bold}{/magenta-fg}`,
          "",
          "{green-fg}{bold}[T]{/bold}{/green-fg} Confirm    {red-fg}{bold}[N]{/bold}{/red-fg} Cancel",
        ].join("\n"),
      });
      this.screen.append(box);
      this.screen.render();

      const finish = (confirm: boolean) => {
        this.game.decideTakeover(confirm);
        this.screen.remove(box);
        this.render();
        this.screen.render();
        resolve();
      };

      this.screen.onceKey("t", () => finish(true));
      this.screen.onceKey("n", () => finish(false));
    });
  }

  private showChancePopup(playerName: string, card: ChanceCard): void {
    const box = blessed.box({
      top: 'center',
      left: 'center',
      width: '38%',
      height: '28%',
      border: { type: 'line' },
      label: ' Chance ',
      tags: true,
      align: 'center' as const,
      valign: 'middle' as const,
      style: { border: { fg: 'blue' }, label: { fg: 'blue', bold: true } },
      content: [
        `{bold}{blue-fg}${playerName}{/blue-fg}{/bold}`,
        '',
        `{bold}{yellow-fg}${card.title}{/yellow-fg}{/bold}`,
        `${card.description}`,
      ].join('\n'),
    });
    this.screen.append(box);
    this.screen.render();
    const duration = 1500 + Math.random() * 1500;
    setTimeout(() => {
      this.screen.remove(box);
      this.screen.render();
    }, duration);
  }

    private sellCheapest(): void {
    const p = this.game.currentPlayer;
    if (p.properties.length === 0) return;
    const cheapest = [...p.properties].sort((a, b) => a.price - b.price)[0]!;
    this.game.sellProperty(p, cheapest.id);
    this.render();
  }

  private render(): void {
    this.boardView.render(this.game.board, this.game.players);
    this.playerView.render(this.game.players, this.game.currentPlayer.id);
    this.propertyInfo.render(this.game.board, this.game.players);
    this.screen.render();
  }

  private serialize(): SaveData {
    return {
      currentPlayer: this.game.currentPlayer.id,
      players: this.game.players.map((p): SavedPlayerData => ({
        id: p.id, name: p.name, kind: p.kind, money: p.money,
        position: p.position, status: p.status, properties: p.properties.map(x => x.id),
      })),
      savedAt: new Date().toISOString(),
    };
  }
}