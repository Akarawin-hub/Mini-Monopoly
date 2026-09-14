import type { Player } from "../Player";

export class Winner {
  findWinner(players: Player[]): Player | null {
    const activePlayers = players.filter((player) => !player.getIsBankrupt());
    if (activePlayers.length === 1) {
      return activePlayers[0];
    }
    return null;
  }
}