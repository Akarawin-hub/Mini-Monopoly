import blessed from "blessed";

const FACE_WIDTH = 13;
const INSET = 2;

const DOT = "{bold}{white-fg}●{/white-fg}{/bold}";
const BLANK = " ".repeat(FACE_WIDTH);
const LEFT_ONLY = " ".repeat(INSET) + DOT + " ".repeat(FACE_WIDTH - INSET - 1);
const RIGHT_ONLY = " ".repeat(FACE_WIDTH - INSET - 1) + DOT + " ".repeat(INSET);
const BOTH_ENDS = " ".repeat(INSET) + DOT + " ".repeat(FACE_WIDTH - 2 * INSET - 2) + DOT + " ".repeat(INSET);
const CENTER = " ".repeat((FACE_WIDTH - 1) / 2) + DOT + " ".repeat((FACE_WIDTH - 1) / 2);

const FACE_ROWS: Record<number, [string, string, string]> = {
    1: [BLANK, CENTER, BLANK],
    2: [LEFT_ONLY, BLANK, RIGHT_ONLY],
    3: [LEFT_ONLY, CENTER, RIGHT_ONLY],
    4: [BOTH_ENDS, BLANK, BOTH_ENDS],
    5: [BOTH_ENDS, CENTER, BOTH_ENDS],
    6: [BOTH_ENDS, BOTH_ENDS, BOTH_ENDS],
};

export class DiceView {
    public readonly box = blessed.box({
        label: " Dices ", border: { type: "line" },
        style: {
            border: { fg: "cyan" },
            label: { fg: "white", bold: true },
        },
        tags: true, align: "center" as const, valign: "middle" as const, padding: { left: 1, right: 1, top: 0, bottom: 0 },
    });

    private die = 0;
    private settled = true;

    public render(die: number, settled = true): void {
        this.die = die;
        this.settled = settled;
        this.draw();
    }

    public async animateRoll(finalValue: number, onFrame?: () => void): Promise<void> {
        const frameDelaysMs = [80, 90, 110, 140, 170, 210, 260];
        for (const delay of frameDelaysMs) {
            const randomFace = Math.floor(Math.random() * 6) + 1;
            this.render(randomFace, false);
            onFrame?.();
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        this.render(finalValue, true);
        onFrame?.();
    }

    private draw(): void {
        if (this.die === 0) {
            this.box.setContent("\n{white-fg}Roll to see dice{/white-fg}");
            return;
        }

        const [top, middle, bottom] = FACE_ROWS[this.die] ?? FACE_ROWS[1]!;
        const horizontalLine = "═".repeat(FACE_WIDTH);
        const frameColor = this.settled ? "green" : "cyan";
        const border = {
            top: `{${frameColor}-fg}╔${horizontalLine}╗{/${frameColor}-fg}`,
            bottom: `{${frameColor}-fg}╚${horizontalLine}╝{/${frameColor}-fg}`,
        };

        const faceRows = [top, BLANK, middle, BLANK, bottom];
        const lines: string[] = [border.top];
        for (const row of faceRows) {
            lines.push(`{${frameColor}-fg}║{/${frameColor}-fg}${row}{${frameColor}-fg}║{/${frameColor}-fg}`);
        }
        lines.push(border.bottom);
        lines.push("");
        lines.push(this.settled ? `{bold}{green-fg}+ Rolled : ${this.die}{/green-fg}{/bold}` : `{white-fg}Rolling…{/white-fg}`,);
        this.box.setContent(lines.join("\n"));
    }
}