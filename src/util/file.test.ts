import { resolve } from "path";
import { isFileExist } from "./file";

test("util/file::isFileExist - file exist so value will be true", async () => {
    expect.assertions(1);

    const result = await isFileExist(resolve(__dirname, "..", "..", "package.json"));
    expect(result).toBe(true);
});

test("util/file::isFileExist - file not exist so value will be false", async () => {
    expect.assertions(1);

    const result = await isFileExist(resolve(__dirname, "..", "..", "qweasdzxc.jskd"));
    expect(result).toBe(false);
});
