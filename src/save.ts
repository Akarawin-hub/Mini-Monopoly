import { mkdir } from "node:fs/promises";
import type { SaveData } from "./game/Types";

declare namespace Bun {
    function write(path: string, data: string): Promise<number>;

    interface BunFile {
        exists(): Promise<boolean>;
        text(): Promise<string>;
    }

    function file(path: string): BunFile;
}

export const writeSave = async (file: string, data: SaveData): Promise<void> => {
    await mkdir(new URL(".", `file://${process.cwd()}/`).pathname, { recursive: true }).catch(() => { });
    await Bun.write(file, JSON.stringify(data, null, 2));
};

export const readSave = async (file: string): Promise<SaveData | null> => {
    const f = Bun.file(file);
    if (!(await f.exists())) return null;
    return JSON.parse(await f.text()) as SaveData;
};