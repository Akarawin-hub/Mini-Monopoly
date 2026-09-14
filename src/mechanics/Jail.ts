export class Jail {
    public Position = 12


    onTheTile(player:Player){
        if (Player = this.Position) {
            player.inJail = true
        }
    }
    bribe(player: Player): boolean{
        if (player.money <= 500) {
            player.removeMoney(500)
            inJail = false
            return true
        } else {
            return false
        }
    }
    skip(player: Player): void{
        player.inJail = false
        game.log (`${player.name} is in jail skip 1 turn`)
    }
}