import { ChatInputCommandInteraction, Client, REST } from "discord.js";
import { loadConfig } from "./store/config";
import { getChannels, loadChannel } from "./store/channel";
import { startInterval } from "./interval";
import { registerSend } from "./send";
import { setClient } from "./store/client";
import { registerCommands } from "./command-register";
import { commandHandlers, commands } from "./commands";

(async () => {
    const config = await loadConfig();

    const client = new Client({
        intents: ["Guilds", "GuildMessages", "MessageContent"]
    });

    client.on("ready", async (c) => {
        setClient(c);
        console.log(`Bot logged in as ${c.user.tag}`);

        console.log("Registering commands...");
        const rest = new REST({ version: "10" });
        rest.setToken(config.botToken);
        await registerCommands(rest, c.application.id, commands);
        console.log(`Commands registered: ${commands.length} commands.`);

        console.log("Load channels...");
        await loadChannel();
        console.log(`Channels loaded: ${getChannels().length} channels.`);

        registerSend();
        startInterval();
    });

    client.on("interactionCreate", async (interaction) => {
        if (interaction.isChatInputCommand()) {
            const i = interaction as ChatInputCommandInteraction;
            const targetHandler = commandHandlers[i.commandName];

            if (typeof targetHandler != "undefined") {
                console.log(`Handle command: ${i.commandName} (${i.id})`);
                const start = new Date();
                await targetHandler(i);
                const end = new Date();
                console.log(`Command finished: ${i.commandName} (${i.id}) - ${end.valueOf() - start.valueOf()}ms`);
            }
        }
    });

    await client.login(config.botToken);
})();
