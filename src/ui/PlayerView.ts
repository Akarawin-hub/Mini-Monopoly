import blessed from "blessed";
import type { Player } from "../game/Player";

export const PLAYER_COLORS: Record<string, [string, string]> = {
    human: ["{yellow-fg}", "{/yellow-fg}"],
    easy: ["{green-fg}", "{/green-fg}"],
    normal: ["{blue-fg}", "{/blue-fg}"],
    hard: ["{red-fg}", "{/red-fg}"],
};

function centerPad(s: string, w: number): string {
    const total = Math.max(0, w - s.length);
    const left = Math.floor(total / 2);
    const right = total - left;
    return " ".repeat(left) + s + " ".repeat(right);
}

export class PlayerView {
    public readonly box = blessed.box({
        label: " Players ",
        border: { type: "line" },
        style: {
            border: { fg: "white" },
            label: { fg: "white", bold: true },
        },
        tags: true,
        padding: { left: 1, right: 1 },
    });

    public render(players: Player[], currentId: string): void {
        const nameWidth = Math.max("Name".length, ...players.map(p => p.name.length));
        const moneyWidth = Math.max("Money".length, ...players.map(p => `$${p.money.toLocaleString()}`.length));
        const propWidth = Math.max("Property".length, ...players.map(p => String(p.properties.length).length));
        const header = `  ${"Name".padEnd(nameWidth)} | ${"Money".padEnd(moneyWidth)} | ${centerPad("Property", propWidth)} | Status`;

        const rows = players.map(p => {
            const isCurrent = p.id === currentId;
            const [colorOpen, colorClose] = PLAYER_COLORS[p.id] ?? ["{red-fg}", "{/red-fg}"];
            const marker = isCurrent ? `${colorOpen}{bold}>{/bold}${colorClose}` : " ";

            let badge: string;
            if (p.status === "bankrupt") {
                badge = "{red-fg}{bold}[BANKRUPT]{/bold}{/red-fg}";
            } else if (p.status === "jailed") {
                badge = "{magenta-fg}{bold}[JAIL]{/bold}{/magenta-fg}";
            } else if (isCurrent) {
                badge = `${colorOpen}{bold}[ACTIVE]{/bold}${colorClose}`;
            } else {
                badge = "{white-fg}[WAITING]{/white-fg}";
            }

            const namePlain = p.name.padEnd(nameWidth);
            const name = `${colorOpen}${namePlain}${colorClose}`;

            const moneyPlain = `$${p.money.toLocaleString()}`.padEnd(moneyWidth);
            const money = p.money < 0 ? `{red-fg}{bold}${moneyPlain}{/bold}{/red-fg}` : `{green-fg}${moneyPlain}{/green-fg}`;

            const propPlain = centerPad(String(p.properties.length), propWidth);
            const properties = `{cyan-fg}${propPlain}{/cyan-fg}`;

            return `${marker} ${name} | ${money} | ${properties} | ${badge}`;
        });

        this.box.setContent([header, ...rows].join("\n"));
    }
}