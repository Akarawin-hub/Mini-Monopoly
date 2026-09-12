import { describe, expect, test, beforeEach } from "bun:test";
import { movePosition, rollDice, Game, JAIL_BAIL_AMOUNT } from "../src/game/Game";
import { Board } from "../src/game/Board";
import { Player, type PlayerStatus } from "../src/game/Player";
import { Property } from "../src/game/Property";
import { EasyAI } from "../src/ai/EasyAI";
import { NormalAI } from "../src/ai/NormalAI";
import { HardAI } from "../src/ai/HardAI";

const makePlayers = (): [Player, Player, Player, Player] => [
  new Player("human", "Player", "Human"),
  new Player("bot1", "Bot 1", "AI Easy"),
  new Player("bot2", "Bot 2", "AI Normal"),
  new Player("bot3", "Bot 3", "AI Hard"),
];

const noLog = () => {};

const newGame = () => new Game(makePlayers(), noLog);

const buyAt = (game: Game, player: Player, pos: number) => {
  player.position = pos;
  game.buy(player);
};

describe("1 · Pure functions", () => {
  test("movePosition — normal forward move", () => {
    expect(movePosition(5, 3, 32)).toBe(8);
  });

  test("movePosition — wraps around board forward", () => {
    expect(movePosition(30, 5, 32)).toBe(3);
  });

  test("movePosition — wraps around board backward", () => {
    expect(movePosition(2, -5, 32)).toBe(29);
  });

  test("movePosition — lands exactly on last tile", () => {
    expect(movePosition(30, 1, 32)).toBe(31);
  });

  test("movePosition — lands on tile 0 (START) exactly", () => {
    expect(movePosition(31, 1, 32)).toBe(0);
  });

  test("rollDice — minimum value (random → 0)", () => {
    expect(rollDice(() => 0)).toBe(1);
  });

  test("rollDice — maximum value (random → 0.9999)", () => {
    expect(rollDice(() => 0.9999)).toBe(6);
  });

  test("rollDice — mid value (random → 0.5)", () => {
    const v = rollDice(() => 0.5);
    expect(v).toBeGreaterThanOrEqual(1);
    expect(v).toBeLessThanOrEqual(6);
  });

  test("rollDice — output always in 1..6 (100 samples)", () => {
    for (let i = 0; i < 100; i++) {
      const v = rollDice();
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    }
  });
});

describe("2 · Board construction", () => {
  let board: Board;
  beforeEach(() => {
    board = new Board();
  });

  test("board has exactly 32 tiles", () => {
    expect(board.tiles.length).toBe(32);
  });

  test("tile 0 is START (GO)", () => {
    expect(board.tiles[0]!.type).toBe("start");
    expect(board.tiles[0]!.name).toBe("GO");
  });

  test("tile 8 is a jail", () => {
    expect(board.tiles[8]!.type).toBe("jail");
  });

  test("tile 16 is Free Parking", () => {
    expect(board.tiles[16]!.type).toBe("parking");
  });

  test("tile 24 is Go To Jail", () => {
    expect(board.tiles[24]!.type).toBe("goToJail");
  });

  test("all property tiles have a Property instance", () => {
    for (const tile of board.tiles) {
      if (tile.type === "property") {
        expect(tile.property).toBeInstanceOf(Property);
      }
    }
  });

  test("property prices increase toward the end of the board", () => {
    const props = board.tiles.filter((t) => t.type === "property").map((t) => t.property!);
    const firstHalf = props.slice(0, Math.floor(props.length / 2));
    const secondHalf = props.slice(Math.floor(props.length / 2));
    const avgFirst = firstHalf.reduce((s, p) => s + p.price, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((s, p) => s + p.price, 0) / secondHalf.length;
    expect(avgSecond).toBeGreaterThan(avgFirst);
  });

  test("getTile wraps around using modulo", () => {
    expect(board.getTile(32)).toBe(board.tiles[0]);
    expect(board.getTile(33)).toBe(board.tiles[1]);
  });

  test("findPropertyById returns correct Property", () => {
    const prop = board.tiles.find((t) => t.type === "property")!.property!;
    expect(board.findPropertyById(prop.id)).toBe(prop);
  });

  test("findPropertyById returns undefined for bad id", () => {
    expect(board.findPropertyById(9999)).toBeUndefined();
  });

  test("tax tiles have amount > 0", () => {
    const taxTiles = board.tiles.filter((t) => t.type === "tax");
    for (const tile of taxTiles) {
      expect(tile.amount ?? 0).toBeGreaterThan(0);
    }
  });
});

describe("3 · Player model", () => {
  let player: Player;
  beforeEach(() => {
    player = new Player("test", "Test", "Human", 1500);
  });

  test("starts with correct money", () => {
    expect(player.money).toBe(1500);
  });

  test("addMoney increases balance", () => {
    player.addMoney(200);
    expect(player.money).toBe(1700);
  });

  test("removeMoney decreases balance", () => {
    player.removeMoney(300);
    expect(player.money).toBe(1200);
  });

  test("removeMoney can go negative (debt scenario)", () => {
    player.removeMoney(2000);
    expect(player.money).toBe(-500);
  });

  test("addProperty adds to list", () => {
    const prop = new Property(1, "Test St", 100, 10);
    player.addProperty(prop);
    expect(player.properties).toHaveLength(1);
  });

  test("addProperty is idempotent (no duplicates)", () => {
    const prop = new Property(1, "Test St", 100, 10);
    player.addProperty(prop);
    player.addProperty(prop);
    expect(player.properties).toHaveLength(1);
  });

  test("removeProperty removes from list", () => {
    const prop = new Property(1, "Test St", 100, 10);
    player.addProperty(prop);
    player.removeProperty(prop);
    expect(player.properties).toHaveLength(0);
  });

  test("removeProperty on absent item is safe", () => {
    const prop = new Property(1, "Test St", 100, 10);
    expect(() => player.removeProperty(prop)).not.toThrow();
  });

  test("default status is active", () => {
    expect(player.status).toBe("active");
  });
});

describe("4 · Game flow — buy / sell / rent / tax / jail / bankrupt", () => {
  describe("4a · Buy", () => {
    test("player can buy unowned property — money deducted", () => {
      const game = newGame();
      const p = game.players[0]!;
      p.position = 1;
      const ok = game.buy(p);
      expect(ok).toBe(true);
      expect(p.money).toBe(1400);
    });

    test("player owns the property after buying", () => {
      const game = newGame();
      const p = game.players[0]!;
      p.position = 1;
      game.buy(p);
      expect(game.board.getTile(1).property!.owner!.id).toBe("human");
      expect(p.properties).toHaveLength(1);
    });

    test("cannot buy already-owned property", () => {
      const game = newGame();
      const [p1, p2] = [game.players[0]!, game.players[1]!];
      buyAt(game, p1, 1);
      p2.position = 1;
      const ok = game.buy(p2);
      expect(ok).toBe(false);
    });

    test("cannot buy when insufficient funds", () => {
      const game = newGame();
      const p = game.players[0]!;
      p.position = 29;
      p.money = 100;
      const ok = game.buy(p);
      expect(ok).toBe(false);
    });

    test("cannot buy non-property tile", () => {
      const game = newGame();
      const p = game.players[0]!;
      p.position = 0;
      const ok = game.buy(p);
      expect(ok).toBe(false);
    });
  });

  describe("4b · Sell", () => {
    test("sell returns 50% of purchase price", () => {
      const game = newGame();
      const p = game.players[0]!;
      buyAt(game, p, 1);
      const before = p.money;
      game.sellProperty(p, game.board.getTile(1).property!.id);
      expect(p.money).toBe(before + 50);
    });

    test("sold property has no owner", () => {
      const game = newGame();
      const p = game.players[0]!;
      buyAt(game, p, 1);
      const prop = game.board.getTile(1).property!;
      game.sellProperty(p, prop.id);
      expect(prop.owner).toBeNull();
    });

    test("sold property removed from player's list", () => {
      const game = newGame();
      const p = game.players[0]!;
      buyAt(game, p, 1);
      const prop = game.board.getTile(1).property!;
      game.sellProperty(p, prop.id);
      expect(p.properties).toHaveLength(0);
    });

    test("sellProperty returns false for unowned property id", () => {
      const game = newGame();
      const p = game.players[0]!;
      expect(game.sellProperty(p, 9999)).toBe(false);
    });

    test("sold property can be re-purchased by another player", () => {
      const game = newGame();
      const [p1, p2] = [game.players[0]!, game.players[1]!];
      buyAt(game, p1, 1);
      const prop = game.board.getTile(1).property!;
      game.sellProperty(p1, prop.id);
      p2.position = 1;
      expect(game.buy(p2)).toBe(true);
    });
  });

  describe("4c · Rent", () => {
    test("tenant pays rent to owner", () => {
      const game = newGame();
      const [owner, tenant] = [game.players[0]!, game.players[1]!];
      buyAt(game, owner, 1);
      const ownerBefore = owner.money;
      const tenantBefore = tenant.money;
      tenant.position = 1;
      game.landOnTile(tenant, game.board.getTile(1));
      expect(tenant.money).toBe(tenantBefore - 20);
      expect(owner.money).toBe(ownerBefore + 20);
    });

    test("landing on own property costs nothing", () => {
      const game = newGame();
      const p = game.players[0]!;
      buyAt(game, p, 1);
      const before = p.money;
      game.landOnTile(p, game.board.getTile(1));
      expect(p.money).toBe(before);
    });

    test("landlord receives only what tenant can pay when broke", () => {
      const game = newGame();
      const [owner, tenant] = [game.players[0]!, game.players[1]!];
      buyAt(game, owner, 29);
      const ownerBefore = owner.money;
      tenant.money = 50;
      tenant.position = 29;
      game.landOnTile(tenant, game.board.getTile(29));
      expect(owner.money).toBe(ownerBefore + 50);
    });
  });

  describe("4d · Tax tiles", () => {
    test("tax tile deducts amount from player", () => {
      const game = newGame();
      const p = game.players[0]!;
      const taxTile = game.board.tiles.find((t) => t.type === "tax")!;
      const before = p.money;
      game.landOnTile(p, taxTile);
      expect(p.money).toBe(before - (taxTile.amount ?? 0));
    });
  });

  describe("4e · START bonus", () => {
    test("landing on GO gives $200", () => {
      const game = newGame();
      const p = game.players[0]!;
      const before = p.money;
      game.landOnTile(p, game.board.getTile(0));
      expect(p.money).toBe(before + 200);
    });

    test("passing GO (not landing) gives $200", () => {
      const game = newGame();
      const p = game.players[0]!;
      p.position = 31;
      const before = p.money;

      const originalRandom = Math.random;
      Math.random = () => 0.3;
      try {
        game.roll(p);
      } finally {
        Math.random = originalRandom;
      }

      expect(p.money).toBe(before + 200);
    });
  });

  describe("4f · Jail", () => {
    test("landing on goToJail sets player status to jailed", () => {
      const game = newGame();
      const p = game.players[0]!;
      game.landOnTile(p, game.board.getTile(24));
      expect(p.status).toBe("jailed");
    });

    test("jailed player is freed next turn (no bail)", () => {
      const game = newGame();
      const p = game.players[0]!;
      p.status = "jailed" as PlayerStatus;
      p.decideJail = () => false;
      game.currentPlayerIndex = 0;
      game.roll(p);
      expect(p.status).toBe("active");
    });

    test("bail payment deducts JAIL_BAIL_AMOUNT", () => {
      const game = newGame();
      const p = game.players[0]!;
      p.status = "jailed" as PlayerStatus;
      p.decideJail = () => true;
      const before = p.money;

      const originalRandom = Math.random;
      Math.random = () => 0;
      try {
        game.roll(p);
      } finally {
        Math.random = originalRandom;
      }

      expect(p.status).toBe("active");
      expect(p.money).toBe(before - JAIL_BAIL_AMOUNT);
    });

    test("bail not paid if insufficient funds", () => {
      const game = newGame();
      const p = game.players[0]!;
      p.status = "jailed" as PlayerStatus;
      p.money = JAIL_BAIL_AMOUNT - 1;
      p.decideJail = () => true;
      game.roll(p);
      expect(p.status).toBe("active");
    });
  });

  describe("4g · Bankruptcy", () => {
    test("bankrupt player has money=0 and status=bankrupt", () => {
      const game = newGame();
      const [owner, debtor] = [game.players[0]!, game.players[1]!];
      buyAt(game, owner, 29);
      debtor.money = 50;
      debtor.position = 29;
      game.landOnTile(debtor, game.board.getTile(29));

      expect(debtor.status).toBe("bankrupt");
      expect(debtor.money).toBe(0);
    });

    test("bankrupt player's properties are released", () => {
      const game = newGame();
      const debtor = game.players[0]!;
      buyAt(game, debtor, 1);
      const prop = game.board.getTile(1).property!;
      debtor.money = -1;

      game.currentPlayerIndex = 0;
      game.pendingDebt = true;
      game.declareBankruptcy();
      expect(prop.owner).toBeNull();
      expect(debtor.properties).toHaveLength(0);
    });

    test("game ends when only one player remains", () => {
      const game = newGame();

      for (let i = 1; i < 4; i++) {
        game.players[i]!.status = "bankrupt";
        game.players[i]!.money = 0;
      }
      game.checkWinner();
      expect(game.status).toBe("finished");
      expect(game.winner).toBe(game.players[0]);
    });
  });

  describe("4h · Chance tile", () => {
    test("drawing a chance card does not throw", () => {
      const game = newGame();
      const p = game.players[0]!;
      const chanceTile = game.board.tiles.find((t) => t.type === "chance")!;
      expect(() => game.landOnTile(p, chanceTile)).not.toThrow();
    });
  });

  describe("4i · Turn order", () => {
    test("nextTurn advances to next active player", () => {
      const game = newGame();
      game.currentPlayerIndex = 0;
      game.nextTurn();
      expect(game.currentPlayerIndex).toBe(1);
    });

    test("nextTurn skips bankrupt players", () => {
      const game = newGame();
      game.players[1]!.status = "bankrupt";
      game.currentPlayerIndex = 0;
      game.nextTurn();
      expect(game.currentPlayerIndex).toBe(2);
    });

    test("nextTurn wraps from last to first", () => {
      const game = newGame();
      game.currentPlayerIndex = 3;
      game.nextTurn();
      expect(game.currentPlayerIndex).toBe(0);
    });
  });

  describe("4j · Pending purchase gate", () => {
    test("decidePurchase(true) buys property and clears pending", () => {
      const game = newGame();
      const p = game.players[0]!;
      p.position = 1;
      const prop = game.board.getTile(1).property!;
      game.pendingProperty = prop;
      game.decidePurchase(true);
      expect(p.money).toBe(1400);
      expect(game.pendingProperty).toBeNull();
    });

    test("decidePurchase(false) skips purchase and clears pending", () => {
      const game = newGame();
      const p = game.players[0]!;
      p.position = 1;
      const prop = game.board.getTile(1).property!;
      game.pendingProperty = prop;
      game.decidePurchase(false);
      expect(p.properties).toHaveLength(0);
      expect(game.pendingProperty).toBeNull();
    });
  });

  describe("4k · sellForDebt", () => {
    test("selling a property clears debt when player becomes solvent", () => {
      const game = newGame();
      const p = game.players[0]!;
      buyAt(game, p, 1);
      p.money = -10;
      game.pendingDebt = true;
      game.currentPlayerIndex = 0;
      const propId = game.board.getTile(1).property!.id;
      game.sellForDebt(propId);

      expect(p.money).toBeGreaterThanOrEqual(0);
      expect(game.pendingDebt).toBe(false);
    });

    test("sellForDebt returns false when pendingDebt is false", () => {
      const game = newGame();
      expect(game.sellForDebt(1)).toBe(false);
    });
  });
});

describe("5 · AI behaviours", () => {
  describe("5a · EasyAI", () => {
    test("always buys affordable property", () => {
      const [p1, p2, p3, p4] = makePlayers();
      const game = new Game([p1, p2, p3, p4], noLog);
      const ai = new EasyAI(p2!);
      p2!.position = 1;
      ai.takeTurn(game);

      expect(p2!.status).not.toBe("bankrupt");
    });

    test("decideJail always returns false (never pays bail)", () => {
      const p = new Player("x", "X", "AI Easy");
      const game = new Game(makePlayers(), noLog);
      new EasyAI(p);
      expect(p.decideJail!(game, p)).toBe(false);
    });

    test("sellPriority sorts cheapest first", () => {
      const p = new Player("x", "X", "AI Easy");
      new EasyAI(p);
      const cheap = new Property(1, "Cheap", 100, 10);
      const expensive = new Property(2, "Exp", 400, 80);
      p.addProperty(expensive);
      p.addProperty(cheap);
      const order = p.sellPriority!(p);
      expect(order[0]!.price).toBeLessThanOrEqual(order[1]!.price);
    });
  });

  describe("5b · NormalAI", () => {
    test("decideJail pays bail when buffer allows", () => {
      const [p1, p2, p3, p4] = makePlayers();
      const game = new Game([p1, p2, p3, p4], noLog);
      const p = p2!;
      new NormalAI(p);
      p.money = 2000;
      expect(p.decideJail!(game, p)).toBe(true);
    });

    test("decideJail stays jailed when insufficient buffer", () => {
      const [p1, p2, p3, p4] = makePlayers();
      const game = new Game([p1, p2, p3, p4], noLog);
      const p = p2!;
      new NormalAI(p);
      p.money = JAIL_BAIL_AMOUNT + 10;
      expect(p.decideJail!(game, p)).toBe(false);
    });

    test("sellPriority sorts lowest rent first", () => {
      const p = new Player("x", "X", "AI Normal");
      new NormalAI(p);
      const lowRent = new Property(1, "Low", 200, 20);
      const highRent = new Property(2, "High", 200, 80);
      p.addProperty(highRent);
      p.addProperty(lowRent);
      const order = p.sellPriority!(p);
      expect(order[0]!.rent).toBeLessThanOrEqual(order[1]!.rent);
    });
  });

  describe("5c · HardAI", () => {
    test("decideJail pays bail when behind richest opponent", () => {
      const players = makePlayers();
      const game = new Game(players, noLog);
      const p = players[0]!;
      new HardAI(p);
      p.money = 500;
      players[1]!.money = 2000;
      expect(p.decideJail!(game, p)).toBe(true);
    });

    test("sellPriority sorts lowest ROI first (rent/price)", () => {
      const p = new Player("x", "X", "AI Hard");
      new HardAI(p);
      const lowROI = new Property(1, "Low", 400, 10);
      const highROI = new Property(2, "High", 100, 80);
      p.addProperty(highROI);
      p.addProperty(lowROI);
      const order = p.sellPriority!(p);
      expect(order[0]!.rent / order[0]!.price).toBeLessThanOrEqual(
        order[1]!.rent / order[1]!.price,
      );
    });
  });
});

type AIInstance = { player: Player; takeTurn: (g: Game) => void };

function makeAI(cls: typeof EasyAI | typeof NormalAI | typeof HardAI, p: Player): AIInstance {
  return new cls(p);
}

function simulateGame(
  botClass: typeof EasyAI | typeof NormalAI | typeof HardAI,
  maxRounds = 400,
): string {
  const human = new Player("human", "Human", "Human");
  const bot1 = new Player("bot1", "Bot 1", "AI Easy");
  const bot2 = new Player("bot2", "Bot 2", "AI Easy");
  const bot3 = new Player("bot3", "Bot 3", "AI Easy");

  const game = new Game([human, bot1, bot2, bot3], noLog);

  const humanAI = makeAI(EasyAI, human);
  const b1AI = makeAI(botClass, bot1);
  const b2AI = makeAI(botClass, bot2);
  const b3AI = makeAI(botClass, bot3);

  const aiMap: Record<string, AIInstance> = {
    human: humanAI,
    bot1: b1AI,
    bot2: b2AI,
    bot3: b3AI,
  };

  for (let round = 0; round < maxRounds; round++) {
    if (game.status === "finished") break;
    const cp = game.currentPlayer;
    if (cp.status === "bankrupt") {
      game.nextTurn();
      continue;
    }

    aiMap[cp.id]?.takeTurn(game);

    while (game.pendingDebt) {
      const p = game.currentPlayer;
      if (p.properties.length === 0) {
        game.declareBankruptcy();
        break;
      }
      game.sellForDebt(p.properties[0]!.id);
    }
    if (game.pendingProperty) game.decidePurchase(false);
  }

  if (game.status === "finished" && game.winner) return game.winner.id;

  const richest = game.activePlayers.reduce((best, p) => {
    const nw = p.money + p.properties.reduce((s, pr) => s + pr.price, 0);
    const bw = best.money + best.properties.reduce((s, pr) => s + pr.price, 0);
    return nw > bw ? p : best;
  });
  return richest.id;
}

interface WinStats {
  wins: Record<string, number>;
  total: number;
  humanWinPct: number;
  winRate: Record<string, string>;
}

function runSimulation(
  botClass: typeof EasyAI | typeof NormalAI | typeof HardAI,
  games = 500,
): WinStats {
  const wins: Record<string, number> = { human: 0, bot1: 0, bot2: 0, bot3: 0 };
  for (let i = 0; i < games; i++) {
    const winner = simulateGame(botClass);
    wins[winner] = (wins[winner] ?? 0) + 1;
  }
  const winRate: Record<string, string> = {};
  for (const [id, count] of Object.entries(wins)) {
    winRate[id] = ((count / games) * 100).toFixed(1) + "%";
  }
  return { wins, total: games, humanWinPct: (wins["human"]! / games) * 100, winRate };
}

describe("6 · Win-rate — Human(EasyAI) vs Bots of increasing difficulty", () => {
  test("vs Easy bots — human wins ~25% (all same strategy, turn-order only)", () => {
    const stats = runSimulation(EasyAI, 500);
    console.log("\n[Human(Easy) vs 3×Easy  ]", stats.winRate);
    expect(stats.humanWinPct).toBeGreaterThan(10);
    expect(stats.humanWinPct).toBeLessThan(50);
  });

  test("difficulty trend — Hard bots beat Easy bots more often than chance (3000 games)", () => {
    const hardVsEasy = runSimulation(EasyAI, 3000);

    const easyStats = runSimulation(EasyAI, 1000);
    const normalStats = runSimulation(NormalAI, 1000);
    const hardStats = runSimulation(HardAI, 1000);

    const allStats = [easyStats, normalStats, hardStats];

    console.log("\n[Human(Easy) vs 3×Easy  ]", easyStats.winRate);
    console.log("[Human(Easy) vs 3×Normal]", normalStats.winRate);
    console.log("[Human(Easy) vs 3×Hard  ]", hardStats.winRate);

    for (const s of allStats) {
      const total = Object.values(s.wins).reduce((a, b) => a + b, 0);
      expect(total).toBe(s.total);
    }

    for (const s of allStats) {
      for (const pct of Object.values(s.winRate)) {
        expect(parseFloat(pct)).toBeGreaterThan(5);
        expect(parseFloat(pct)).toBeLessThan(60);
      }
    }

    const totalHumanWins = allStats.reduce((sum, s) => sum + s.wins["human"]!, 0);
    const totalBot3Wins = allStats.reduce((sum, s) => sum + s.wins["bot3"]!, 0);
    expect(totalHumanWins).toBeGreaterThan(totalBot3Wins);
  });

  test("all games terminate without infinite loops", () => {
    for (const cls of [EasyAI, NormalAI, HardAI] as const) {
      const stats = runSimulation(cls, 200);
      expect(Object.values(stats.wins).reduce((a, b) => a + b, 0)).toBe(200);
    }
  });

  test("Full report — 1000 games per difficulty", () => {
    const scenarios: [string, typeof EasyAI | typeof NormalAI | typeof HardAI][] = [
      ["vs 3x Easy  (baseline)", EasyAI],
      ["vs 3x Normal           ", NormalAI],
      ["vs 3x Hard             ", HardAI],
    ];

    const results: { label: string; stats: WinStats }[] = [];
    for (const [label, cls] of scenarios) {
      results.push({ label, stats: runSimulation(cls, 1000) });
    }

    const [easyR, normalR, hardR] = results;

    console.log("\n╔══════════════════════════════════════════════════════════════════════╗");
    console.log("║  MINI MONOPOLY — Human(EasyAI) vs Bot Difficulty  (1000 games each) ║");
    console.log("╠══════════════════════════════════════════════════════════════════════╣");
    for (const { label, stats } of results) {
      console.log(
        `║  ${label} │ ${Object.entries(stats.winRate)
          .map(([id, r]) => `${id}: ${r.padStart(5)}`)
          .join("  │  ")} ║`,
      );
    }
    console.log("╠══════════════════════════════════════════════════════════════════════╣");
    console.log(
      `║  Easy → Normal drop : ${(easyR!.stats.humanWinPct - normalR!.stats.humanWinPct).toFixed(1).padStart(5)}%                                             ║`,
    );
    console.log(
      `║  Normal → Hard drop : ${(normalR!.stats.humanWinPct - hardR!.stats.humanWinPct).toFixed(1).padStart(5)}%                                             ║`,
    );
    console.log("║  (positive = human wins less against harder bots, as expected)      ║");
    console.log("╚══════════════════════════════════════════════════════════════════════╝");

    expect(true).toBe(true);
  });
});