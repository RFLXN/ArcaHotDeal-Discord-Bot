import { constants, PathLike } from "fs";
import { access } from "fs/promises";

async function isFileExist(path: PathLike) {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}

export { isFileExist };
