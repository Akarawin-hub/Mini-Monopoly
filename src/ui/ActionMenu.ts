import blessed from "blessed";

export class ActionMenu {
    public readonly box = blessed.box({
        label: " Controls ",
        border: { type: "line" },
        style: {
            border: { fg: "white" },
            label: { fg: "white", bold: true },
        },
        tags: true,
        align: "center" as const,
        valign: "middle" as const,
        content: [
            "{bold}{yellow-fg}ENTER{/yellow-fg} = ROLL{/bold}",
            "{bold}{green-fg}B{/green-fg} = BUY{/bold}",
            "{bold}{red-fg}S{/red-fg} = SELL{/bold}",
            "{bold}{magenta-fg}T{/magenta-fg} = TAKEOVER{/bold}",
            "{bold}{cyan-fg}Q{/cyan-fg} = QUIT{/bold}",
        ].join("   │   "),
    });
}