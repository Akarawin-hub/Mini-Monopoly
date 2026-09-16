import type { ChanceCard, RandomSource } from "./Types";

interface WeightedChanceEvent {
    readonly probability: number;
    readonly card: ChanceCard;
}

const CHANCE_EVENTS: WeightedChanceEvent[] = [
    {
        probability: 0.20,
        card: {
            title: "Forward +5", description: "Move forward 5 spaces.", apply: (p, c) => {
                c.move(p, 5); return `${p.name} moved forward 5 spaces.`;
            }
        },
    },
    {
        probability: 0.15,
        card: {
            title: "+$100", description: "Bank gives you $100.", apply: (p) => {
                p.addMoney(100); return `${p.name} received $100.`;
            }
        },
    },
    {
        probability: 0.20,
        card: {
            title: "-$150", description: "Pay an unexpected bill of $150.", apply: (p, c) => {
                c.payTax(p, 150);
                return `${p.name} paid $150.`;
            }
        },
    },
    {
        probability: 0.20,
        card: {
            title: "+$50", description: "Bank gives you $50.", apply: (p) => {
                p.addMoney(50); return `${p.name} received $50.`;
            }
        },
    },
    {
        probability: 0.10,
        card: {
            title: "Lottery +$300", description: "You won the lottery! +$300.", apply: (p) => {
                p.addMoney(300); return `${p.name} won the lottery and received $300.`;
            }
        },
    },
    {
        probability: 0.15,
        card: {
            title: "Backward -3", description: "Move backward 3 spaces.", apply: (p, c) => {
                c.move(p, -3); return `${p.name} moved backward 3 spaces.`;
            }
        },
    },
];

export const pickChanceEvent = (random: RandomSource = Math.random): ChanceCard => {
    const roll = random();
    let cumulative = 0;
    for (const event of CHANCE_EVENTS) {
        cumulative += event.probability;
        if (roll < cumulative)
            return event.card;
    }
    return CHANCE_EVENTS[CHANCE_EVENTS.length - 1]!.card;
};