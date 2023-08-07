import { resolve } from "path";
import { loadJson, writeJson } from "./json";

const BASE_PATH = resolve(__dirname, "..", "..", "resource");

test("util/json::loadJson - load json file", async () => {
    expect.assertions(1);
    const result = await loadJson(resolve(BASE_PATH, "config.example.json"));
    expect(result).toEqual({
        botToken: "YOUR_DISCORD_BOT_TOKEN_HERE",
        refreshInterval: 3600000,
        headers: {
            Accept: "HTTP_Accept_HEADER_HERE",
            "User-Agent": "HTTP_User-Agent_HEADER_HERE"
        }
    });
});

test("util/json::writeJSon - write json file", async () => {
    expect.assertions(1);

    const PATH = resolve(BASE_PATH, "test.json");
    await writeJson(PATH, { test: "test" });

    const result = await loadJson(PATH);
    expect(result).toEqual({ test: "test" });
});
