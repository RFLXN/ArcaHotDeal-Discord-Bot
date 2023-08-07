import { resolve } from "path";
import { Config } from "../type/config";
import { loadJson } from "../util/json";

const CONFIG_PATH = resolve(__dirname, "..", "..", "resource", "config.json");

const config: Config = {
    botToken: "",
    refreshInterval: 1000 * 60 * 60,
    headers: {
        Accept: "",
        "User-Agent": ""
    }
};

async function loadConfig() {
    const loaded = await loadJson<Config>(CONFIG_PATH);

    config.botToken = loaded.botToken;
    config.headers = loaded.headers;
    config.refreshInterval = loaded.refreshInterval;

    return config;
}

function getConfig() {
    return config;
}

export { loadConfig, getConfig };
