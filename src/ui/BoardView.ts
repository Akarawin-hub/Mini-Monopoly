import blessed from "blessed";
import type { Board } from "../game/Board";
import type { Player } from "../game/Player";
import { PLAYER_COLORS } from "./PlayerView";

export const WORLD_TILES = [

    { index: 0, type: "start", name: "GO" },

    { index: 1, type: "property", name: "Bangkok" },
    { index: 2, type: "property", name: "Hanoi" },
    { index: 3, type: "chance", name: "Chance" },
    { index: 4, type: "property", name: "Jakarta" },
    { index: 5, type: "property", name: "Manila" },
    { index: 6, type: "tax", name: "Tax" },
    { index: 7, type: "property", name: "Oslo" },
    { index: 8, type: "jail", name: "JAIL" },

    { index: 9, type: "property", name: "Tokyo" },
    { index: 10, type: "property", name: "Seoul" },
    { index: 11, type: "chance", name: "Chance" },
    { index: 12, type: "property", name: "Beijing" },
    { index: 13, type: "property", name: "Shanghai" },
    { index: 14, type: "property", name: "HongKong" },
    { index: 15, type: "property", name: "Taipei" },
    { index: 16, type: "parking", name: "FreePark" },

    { index: 17, type: "property", name: "Sydney" },
    { index: 18, type: "property", name: "Auckland" },
    { index: 19, type: "chance", name: "Chance" },
    { index: 20, type: "property", name: "Mumbai" },
    { index: 21, type: "property", name: "Delhi" },
    { index: 22, type: "property", name: "Dubai" },
    { index: 23, type: "property", name: "Istanbul" },
    { index: 24, type: "goToJail", name: "GoJail" },

    { index: 25, type: "property", name: "London" },
    { index: 26, type: "property", name: "Paris" },
    { index: 27, type: "chance", name: "Chance" },
    { index: 28, type: "property", name: "Berlin" },
    { index: 29, type: "property", name: "Rome" },
    { index: 30, type: "property", name: "Madrid" },
    { index: 31, type: "tax", name: "Tax" },
] as const;

const PROPERTY_BAR_COLORS: [string, string][] = [
    ["{cyan-fg}", "{/cyan-fg}"],
    ["{green-fg}", "{/green-fg}"],
    ["{yellow-fg}", "{/yellow-fg}"],
    ["{magenta-fg}", "{/magenta-fg}"],
    ["{red-fg}", "{/red-fg}"],
    ["{blue-fg}", "{/blue-fg}"],
    ["{white-fg}", "{/white-fg}"],
];

const TILE_SUBTEXT: Record<string, string> = {
    start: "+200$",
    tax: "-15%",
    parking: "FREE",
    jail: "",
    goToJail: "",
    chance: "?",
};

const CORNER_WIDTH = 13; // ความกว้างของช่องมุมกระดาน
const TILE_WIDTH = 8;    // ความกว้างของช่องปกติ
const CENTER_WIDTH = TILE_WIDTH * 7 + 6; // ความกว้างพื้นที่กลางกระดาน

function padTagged(taggedText: string, width: number): string {
    const plainText = taggedText.replace(/\{[^}]+\}/g, "");
    let visibleWidth = 0;
    for (const ch of plainText) {
        visibleWidth += (ch.codePointAt(0)! > 0x2E80) ? 2 : 1;
    }
    return taggedText + " ".repeat(Math.max(0, width - visibleWidth));
}

function centerPlain(text: string, width: number): string {
    const totalPadding = Math.max(0, width - text.length);
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    return " ".repeat(leftPadding) + text.slice(0, width) + " ".repeat(rightPadding);
}

function centerTagged(taggedText: string, width: number): string {
    const plainText = taggedText.replace(/\{[^}]+\}/g, "");
    let visibleWidth = 0;
    for (const ch of plainText) {
        visibleWidth += (ch.codePointAt(0)! > 0x2E80) ? 2 : 1;
    }
    const totalPadding = Math.max(0, width - visibleWidth);
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;
    return " ".repeat(leftPadding) + taggedText + " ".repeat(rightPadding);
}

function renderTileName(
    tile: { name: string; type: string; property?: { owner?: { id: string } | null } },
    width: number,
): string {
    const ownerId = tile.type === "property" ? tile.property?.owner?.id : undefined;
    if (!ownerId) return centerPlain(tile.name, width);
    const [colorOpen, colorClose] = PLAYER_COLORS[ownerId] ?? ["{white-fg}", "{/white-fg}"];
    return centerTagged(`${colorOpen}{bold}${tile.name}{/bold}${colorClose}`, width);
}

export class BoardView {
    public readonly box = blessed.box({
        label: " WORLD MONOPOLY ",
        border: { type: "line" },
        style: {
            border: { fg: "cyan" },
            label: { fg: "cyan", bold: true },
        },
        tags: true,
        align: "center" as const,
        valign: "middle" as const,
        padding: { left: 1, right: 1, top: 0, bottom: 0 },
    });

    public render(board: Board, players: Player[], positionOverrides?: Record<string, number>): void {
        const tiles = board.tiles.length >= 32 ? board.tiles : (WORLD_TILES as unknown as typeof board.tiles);
        const topLeftCorner = tiles[0]!;
        const topEdgeTiles = tiles.slice(1, 8);
        const topRightCorner = tiles[8]!;
        const rightEdgeTiles = tiles.slice(9, 16);
        const bottomRightCorner = tiles[16]!;
        const bottomEdgeTiles = [...tiles.slice(17, 24)].reverse();
        const bottomLeftCorner = tiles[24]!;
        const leftEdgeTiles = [...tiles.slice(25, 32)].reverse();

        const positionOf = (p: Player): number => positionOverrides?.[p.id] ?? p.position;
        const playersOnTile = (tileIndex: number): Player[] => players.filter(p => p.status !== "bankrupt" && positionOf(p) === tileIndex);
        const playerLabel = (player: Player): string => `P${players.indexOf(player) + 1}`;
        const playerColor = (player: Player): [string, string] => PLAYER_COLORS[player.id] ?? ["{white-fg}", "{/white-fg}"];

        const renderOccupants = (tileIndex: number): string => {
            const playersHere = playersOnTile(tileIndex);
            if (playersHere.length === 0) return "";

            if (playersHere.length === 1) {
                const [colorOpen, colorClose] = playerColor(playersHere[0]!);
                return `[${colorOpen}{bold}${playerLabel(playersHere[0]!)}{/bold}${colorClose}]`;
            }

            const joinedLabels = playersHere.map(playerLabel).join(",");
            if (joinedLabels.length <= TILE_WIDTH) {
                return playersHere
                    .map(p => {
                        const [colorOpen, colorClose] = playerColor(p);
                        return `${colorOpen}{bold}${playerLabel(p)}{/bold}${colorClose}`;
                    })
                    .join(",");
            }

            const [colorOpen, colorClose] = playerColor(playersHere[0]!);
            return `${colorOpen}{bold}${playerLabel(playersHere[0]!)}{/bold}${colorClose}{gray-fg}+${playersHere.length - 1}{/gray-fg}`;
        };

        const renderOccupantCell = (tileIndex: number, width: number): string => {
            const occupantMark = renderOccupants(tileIndex);
            return occupantMark ? padTagged(occupantMark, width) : " ".repeat(width);
        };

        let propertyBarIndex = 0;
        const renderTopBottomSubtext = (tile: typeof tiles[0], width: number): string => {
            if (tile.type !== "property") return centerPlain(TILE_SUBTEXT[tile.type] ?? "", width);
            const dashLength = Math.max(3, width - 4);
            const [colorOpen, colorClose] = PROPERTY_BAR_COLORS[propertyBarIndex++ % PROPERTY_BAR_COLORS.length]!;
            return centerTagged(`${colorOpen}${"═".repeat(dashLength)}${colorClose}`, width);
        };
        const renderCornerSubtext = (tile: typeof tiles[0]): string => centerPlain(tile.type === "start" ? "+200$" : tile.type === "parking" ? "FREE" : "", CORNER_WIDTH);

        const cornerHorizontalLine = "─".repeat(CORNER_WIDTH);
        const tileHorizontalLine = "─".repeat(TILE_WIDTH);
        const topBorder = "┌" + cornerHorizontalLine + "┬" + Array(7).fill(tileHorizontalLine).join("┬") + "┬" + cornerHorizontalLine + "┐";
        const middleBorder = "├" + cornerHorizontalLine + "┼" + Array(7).fill(tileHorizontalLine).join("┼") + "┼" + cornerHorizontalLine + "┤";
        const bottomBorder = "└" + cornerHorizontalLine + "┴" + Array(7).fill(tileHorizontalLine).join("┴") + "┴" + cornerHorizontalLine + "┘";

        const centerBannerLines: string[] = [
            "",
            "",
            centerTagged(
                "{bold}{yellow-fg}[   MINI MONOPOLY   ]{/yellow-fg}{/bold}",
                CENTER_WIDTH
            ),
            "",
            "",
        ];

        const outputLines: string[] = [];

        outputLines.push(topBorder);
        outputLines.push("│" + centerPlain(topLeftCorner.name, CORNER_WIDTH) + "│" + topEdgeTiles.map(t => renderTileName(t, TILE_WIDTH)).join("│") + "│" + centerPlain(topRightCorner.name, CORNER_WIDTH) + "│");
        outputLines.push("│" + renderCornerSubtext(topLeftCorner) + "│" + topEdgeTiles.map(t => renderTopBottomSubtext(t, TILE_WIDTH)).join("│") + "│" + renderCornerSubtext(topRightCorner) + "│");
        outputLines.push("│" + renderOccupantCell(0, CORNER_WIDTH) + "│" + topEdgeTiles.map((_t, i) => renderOccupantCell(i + 1, TILE_WIDTH)).join("│") + "│" + renderOccupantCell(8, CORNER_WIDTH) + "│");
        outputLines.push(middleBorder);

        const sideRowSeparator = "├" + cornerHorizontalLine + "│" + " ".repeat(CENTER_WIDTH) + "│" + cornerHorizontalLine + "┤";
        for (let row = 0; row < 7; row++) {
            const leftTile = leftEdgeTiles[row]!;
            const rightTile = rightEdgeTiles[row]!;

            const leftNameCell = renderTileName(leftTile, CORNER_WIDTH);
            const leftSubtextCell = renderTopBottomSubtext(leftTile, CORNER_WIDTH);
            const rightNameCell = renderTileName(rightTile, CORNER_WIDTH);
            const rightSubtextCell = renderTopBottomSubtext(rightTile, CORNER_WIDTH);

            const centerCell = padTagged(centerBannerLines[row] ?? "", CENTER_WIDTH);
            outputLines.push(`│${leftNameCell}│${centerCell}│${rightNameCell}│`);
            outputLines.push(`│${leftSubtextCell}│${" ".repeat(CENTER_WIDTH)}│${rightSubtextCell}│`);
            outputLines.push(`│${renderOccupantCell(31 - row, CORNER_WIDTH)}│${" ".repeat(CENTER_WIDTH)}│${renderOccupantCell(9 + row, CORNER_WIDTH)}│`);

            if (row < 6) outputLines.push(sideRowSeparator);
        }

        outputLines.push(middleBorder);

        outputLines.push("│" + centerPlain(bottomLeftCorner.name, CORNER_WIDTH) + "│" + bottomEdgeTiles.map(t => renderTileName(t, TILE_WIDTH)).join("│") + "│" + centerPlain(bottomRightCorner.name, CORNER_WIDTH) + "│");
        outputLines.push("│" + renderCornerSubtext(bottomLeftCorner) + "│" + bottomEdgeTiles.map(t => renderTopBottomSubtext(t, TILE_WIDTH)).join("│") + "│" + renderCornerSubtext(bottomRightCorner) + "│");
        outputLines.push("│" + renderOccupantCell(24, CORNER_WIDTH) + "│" + bottomEdgeTiles.map((_t, i) => renderOccupantCell(23 - i, TILE_WIDTH)).join("│") + "│" + renderOccupantCell(16, CORNER_WIDTH) + "│");
        outputLines.push(bottomBorder);

        this.box.setContent(outputLines.join("\n"));
    }
}