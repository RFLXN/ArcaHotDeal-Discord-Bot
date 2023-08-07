import { PathLike } from "fs";
import { readFile, writeFile } from "fs/promises";

async function loadJson<T extends object>(path: PathLike) {
    const file = await readFile(path);
    return JSON.parse(file.toString()) as T;
}

async function writeJson<T extends object>(path: PathLike, obj: T) {
    const str = JSON.stringify(obj);
    await writeFile(path, str);
}

export { loadJson, writeJson };
