import { describe, expect, test } from "bun:test";
import { movePosition, rollDice, Game } from "../src/game/Game";
import { Player } from "../src/game/Player";

const players = () => [
  new Player("human", "You", "Human"),
  new Player("easy", "Easy", "AI Easy"),
  new Player("normal", "Normal", "AI Normal"),
  new Player("hard", "Hard", "AI Hard"),
];

describe("pure game functions", () => {
  test("movePosition wraps around board", () => {
    expect(movePosition(22, 5, 24)).toBe(3);
    expect(movePosition(2, -5, 24)).toBe(21);
  });

  test("rollDice is 1..6", () => {
    expect(rollDice(() => 0)).toBe(1);
    expect(rollDice(() => 0.99999)).toBe(6);
  });
});

describe("game core", () => {
  test("player can buy unowned property", () => {
    const ps = players();
    const game = new Game(ps);
    ps[0]!.position = 1;
    expect(game.buy(ps[0]!)).toBe(true);
    expect(ps[0]!.money).toBe(1400);
    expect(ps[0]!.properties[0]!.name).toBe("Bangkok");
  });

  test("rent transfers money", () => {
    const ps = players();
    const game = new Game(ps);
    ps[0]!.position = 1;
    game.buy(ps[0]!);
    ps[1]!.position = 1;
    game.resolveTile(ps[1]!, game.board.getTile(1));
    expect(ps[1]!.money).toBe(1480);
    expect(ps[0]!.money).toBe(1420);
  });
});
