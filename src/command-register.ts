import { REST, Routes, SlashCommandBuilder } from "discord.js";

async function registerCommands(rest: REST, clientId: string, commands: Partial<SlashCommandBuilder>[]) {
    await rest.put(Routes.applicationCommands(clientId), {
        body: commands
    });
}

export { registerCommands };
