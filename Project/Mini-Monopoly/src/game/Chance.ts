import type { Player } from "./Player";

export interface ChanceContext {
  readonly move: (player: Player, steps: number) => void;
  readonly payTax: (player: Player, amount: number) => void;
}

export interface ChanceCard {
  readonly title: string;
  readonly description: string;
  readonly apply: (player: Player, context: ChanceContext) => string;
}

export const createChanceDeck = (): ChanceCard[] => [
  { title: "+$100", description: "Bank gives you $100.", apply: (p) => { 
      p.addMoney(100); return `${p.name} received $100.`;
    }
  },
  { title: "-$100", description: "Pay an unexpected bill.", apply: (p, c) => { c.payTax(p, 100); 
      return `${p.name} paid $100.`; 
    } 
  },
  { title: "Forward", description: "Move forward 3 spaces.", apply: (p, c) => { c.move(p, 3); 
      return `${p.name} moved forward 3 spaces.`; 
    } 
  },
  { title: "Backward", description: "Move backward 2 spaces.", apply: (p, c) => { c.move(p, -2); 
      return `${p.name} moved backward 2 spaces.`; 
    } 
  },
  { title: "Tax", description: "Pay $75 tax.", apply: (p, c) => { c.payTax(p, 75); 
      return `${p.name} paid $75 tax.`; 
    } 
  },
];

