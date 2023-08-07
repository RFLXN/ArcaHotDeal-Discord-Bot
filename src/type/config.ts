interface Config {
    botToken: string,
    refreshInterval: number,
    headers: {
        Accept: string,
        "User-Agent": string
    }
}

export { Config };
