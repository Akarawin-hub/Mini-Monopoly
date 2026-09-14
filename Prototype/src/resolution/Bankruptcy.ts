import { Player } from "../Player";

export class Bankruptcy {
  declareBankrupt(player: Player): void {
    if (player.getIsBankrupt()) {
      return;
    }

    const properties = [...player.getProperties()];

    for (const property of properties) {
      property.setOwner(null);
      property.clearRentPool();
      player.removeProperty(property);
    }

    player.setBankrupt(true);
  }
}