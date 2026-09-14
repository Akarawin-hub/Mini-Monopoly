import type { Player } from "../Player";

export class GameResult {
  private finished: boolean;
  private winner: Player | null;

  constructor(finished: boolean = false, winner: Player | null = null) {
    this.finished = finished;
    this.winner = winner;
  }

  isFinished(): boolean {
    return this.finished;
  }

  getWinner(): Player | null {
    return this.winner;
  }
  
  setResult(winner: Player | null): void {
    this.winner = winner;
    this.finished = winner !== null;
  }
}