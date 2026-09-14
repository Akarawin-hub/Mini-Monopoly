export class Chance {
    public position:number
}

export type ChanceEvent =
    | "MOVE_FORWARD_5"
    | "MONEY_PLUS_100"
    | "MONEY_MINUS_350"
    | "DICE_X2"
    | "LOTTERY_PLUS_300"
    | "MOVE_BACKWARD_3"
