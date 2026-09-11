import blessed from "blessed";

const CATEGORIES: { match: RegExp; icon: string; color: string }[] = [
    { match: /wins the game/i, icon: "★", color: "yellow" },
    { match: /is BANKRUPT/i, icon: "X", color: "red" },
    { match: /rent/i, icon: "$", color: "yellow" },
    { match: /tax/i, icon: "%", color: "magenta" },
    { match: /bought/i, icon: ">", color: "green" },
    { match: /sold/i, icon: "<", color: "cyan" },
    { match: /sent to Jail|leaves Jail/i, icon: "!", color: "red" },
    { match: /Chance:/i, icon: "?", color: "blue" },
    { match: /rolled/i, icon: "*", color: "cyan" },
    { match: /passed START/i, icon: "+", color: "green" },
];
const DEFAULT_CATEGORY = { icon: "-", color: "white" };

export class GameLog {
    public readonly box = blessed.box({
        label: " Game Logs ",
        border: { type: "line" },
        style: {
            border: { fg: "white" },
            label: { fg: "white", bold: true },
        },
        tags: true,
        wrap: false,
        scrollable: true,
        alwaysScroll: true,
        keys: true,
        mouse: true,
        padding: { left: 1, right: 1 },
    });

    private readonly messages: string[] = [];

    constructor() {
        this.box.on("attach", () => {
            const screen = this.box.screen;
            screen.key(["up"], () => this.scroll(-1));
            screen.key(["down"], () => this.scroll(1));
        });
    }

    private contentWidth(): number {
        const w = typeof this.box.width === "number" ? this.box.width : 40;
        return Math.max(10, w - 4);
    }

    public add(message: string): void {
        const category = CATEGORIES.find(c => c.match.test(message)) ?? DEFAULT_CATEGORY;
        const prefixWidth = 4;
        const budget = Math.max(0, this.contentWidth() - prefixWidth);
        const trimmed = message.length > budget ? message.slice(0, Math.max(0, budget - 1)) + "…" : message;
        const line = `${category.icon} | {${category.color}-fg}${trimmed}{/${category.color}-fg}`;
        this.messages.push(line);
        if (this.messages.length > 80) this.messages.shift();

        this.box.setContent(this.messages.join("\n"));
        this.box.setScrollPerc(100);
    }

    public scroll(lines: number): void {
        this.box.scroll(lines);
        this.box.screen.render();
    }
}