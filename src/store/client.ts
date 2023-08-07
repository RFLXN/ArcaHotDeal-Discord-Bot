import { Client } from "discord.js";

let clientStore: Client<true>;

function setClient(client: Client<true>) {
    clientStore = client;
}

function getClient() {
    return clientStore;
}

export { setClient, getClient };
