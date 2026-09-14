export type TileType = "property" | "chance" | "tax" | "start" | "jail" | "goToJail" | "parking";

export interface TileDef {
  readonly index: number;
  readonly type:  TileType;
  readonly name:  string;
  readonly rent:  number;
  readonly price: number;
  readonly isCorner: boolean;
}

export const BOARD_32: TileDef[] = [
  { index:0,  type:"start",    name:"GO",          rent:0,   price:0,   isCorner:true  },

  { index:1,  type:"property", name:"Bangkok",     rent:20,  price:100, isCorner:false },
  { index:2,  type:"property", name:"Hanoi",       rent:20,  price:100, isCorner:false },
  { index:3,  type:"chance",   name:"Chance",      rent:0,   price:0,   isCorner:false },
  { index:4,  type:"property", name:"Jakarta",     rent:30,  price:140, isCorner:false },
  { index:5,  type:"property", name:"Manila",      rent:30,  price:140, isCorner:false },
  { index:6,  type:"tax",      name:"Tax",         rent:100, price:0,   isCorner:false },
  { index:7,  type:"property", name:"Oslo",        rent:35,  price:160, isCorner:false },

  { index:8,  type:"jail",     name:"JAIL",        rent:0,   price:0,   isCorner:true  },

  { index:9,  type:"property", name:"Tokyo",       rent:40,  price:180, isCorner:false },
  { index:10, type:"property", name:"Seoul",       rent:40,  price:180, isCorner:false },
  { index:11, type:"chance",   name:"Chance",      rent:0,   price:0,   isCorner:false },
  { index:12, type:"property", name:"Beijing",     rent:50,  price:220, isCorner:false },
  { index:13, type:"property", name:"Shanghai",    rent:50,  price:220, isCorner:false },
  { index:14, type:"property", name:"HongKong",    rent:55,  price:240, isCorner:false },
  { index:15, type:"property", name:"Taipei",      rent:55,  price:240, isCorner:false },

  { index:16, type:"parking",  name:"Free Park",   rent:0,   price:0,   isCorner:true  },

  { index:17, type:"property", name:"Sydney",      rent:60,  price:260, isCorner:false },
  { index:18, type:"property", name:"Auckland",    rent:60,  price:260, isCorner:false },
  { index:19, type:"chance",   name:"Chance",      rent:0,   price:0,   isCorner:false },
  { index:20, type:"property", name:"Mumbai",      rent:65,  price:280, isCorner:false },
  { index:21, type:"property", name:"Delhi",       rent:65,  price:280, isCorner:false },
  { index:22, type:"property", name:"Dubai",       rent:70,  price:300, isCorner:false },
  { index:23, type:"property", name:"Istanbul",    rent:75,  price:320, isCorner:false },

  { index:24, type:"goToJail", name:"Go Jail",     rent:0,   price:0,   isCorner:true  },

  { index:25, type:"property", name:"London",      rent:80,  price:350, isCorner:false },
  { index:26, type:"property", name:"Paris",       rent:80,  price:350, isCorner:false },
  { index:27, type:"chance",   name:"Chance",      rent:0,   price:0,   isCorner:false },
  { index:28, type:"property", name:"Berlin",      rent:85,  price:370, isCorner:false },
  { index:29, type:"property", name:"Rome",        rent:90,  price:400, isCorner:false },
  { index:30, type:"property", name:"Madrid",      rent:90,  price:400, isCorner:false },
  { index:31, type:"tax",      name:"Tax",         rent:150, price:0,   isCorner:false },
];

export const BOARD_SIZE = BOARD_32.length; // 32
export const CORNERS = [0, 8, 16, 24] as const;
export const isCorner = (idx: number) => CORNERS.includes(idx as typeof CORNERS[number]);

