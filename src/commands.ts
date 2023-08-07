import {
    APIApplicationCommandOptionChoice,
    ChannelType,
    ChatInputCommandInteraction,
    SlashCommandBooleanOption,
    SlashCommandBuilder,
    SlashCommandChannelOption,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder
} from "discord.js";
import { Categories, CategoryKey, HotDealCategory } from "./type/ArcaLive";
import { addCategoryToChannel, removeCategoryFromChannel } from "./store/channel";

const categoryChoices: APIApplicationCommandOptionChoice<string>[] = Categories.map((category) => ({
    name: HotDealCategory[category],
    value: category
}));

const addCommand = new SlashCommandSubcommandBuilder()
    .setName("add")
    .setDescription("add hot-deal subscription.")
    .setNameLocalization("ko", "추가")
    .setDescriptionLocalization("ko", "핫딜 구독을 추가합니다.")
    .addChannelOption(
        new SlashCommandChannelOption()
            .setName("channel")
            .setDescription("channel for add hot-deal subscription")
            .setNameLocalization("ko", "채널")
            .setDescriptionLocalization("ko", "핫딜 구독을 추가할 채널")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(
        new SlashCommandStringOption()
            .setName("category")
            .setDescription("hot-deal category")
            .setNameLocalization("ko", "카테고리")
            .setDescriptionLocalization("ko", "핫딜 카테고리")
            .setRequired(true)
            .addChoices(...categoryChoices)
    )
    .addBooleanOption(
        new SlashCommandBooleanOption()
            .setName("super-hotdeal")
            .setDescription("is subscribe super hot-deal only?")
            .setNameLocalization("ko", "초핫딜")
            .setDescriptionLocalization("ko", "초핫딜만 구독할지 여부")
            .setRequired(true)
    );

const cancelCommand = new SlashCommandSubcommandBuilder()
    .setName("cancel")
    .setDescription("cancel hot-deal subscription.")
    .setNameLocalization("ko", "취소")
    .setDescriptionLocalization("ko", "핫딜 구독을 취소합니다.")
    .addChannelOption(
        new SlashCommandChannelOption()
            .setName("channel")
            .setDescription("channel for cancel hot-deal subscription")
            .setNameLocalization("ko", "채널")
            .setDescriptionLocalization("ko", "핫딜 구독을 취소할 채널")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(
        new SlashCommandStringOption()
            .setName("category")
            .setDescription("hot-deal category")
            .setNameLocalization("ko", "카테고리")
            .setDescriptionLocalization("ko", "핫딜 카테고리")
            .setRequired(true)
            .addChoices(...categoryChoices)
    );

const subscriptionCommand = new SlashCommandBuilder()
    .setName("subscription")
    .setDescription("commands for subscription")
    .setNameLocalization("ko", "구독")
    .addSubcommand(addCommand)
    .addSubcommand(cancelCommand);

async function subscriptionCommandHandler(interaction: ChatInputCommandInteraction) {
    if (!(interaction.memberPermissions && interaction.memberPermissions.has("Administrator"))) {
        await interaction.reply({
            content: "This is admin only command."
        });
        return;
    }

    const subCommand = interaction.options.getSubcommand(true);

    const channel = interaction.options.getChannel("channel", true, [ChannelType.GuildText]);
    const category = interaction.options.getString("category", true) as CategoryKey;

    if (subCommand == "add") {
        const superHotDealOnly = interaction.options.getBoolean("super-hotdeal", true);
        await addCategoryToChannel(channel.id, category, superHotDealOnly);

        await interaction.reply({
            content: `구독 정보 변경: <#${channel.id}> 채널에 '${HotDealCategory[category]}'를 구독합니다. `
                + `(초핫딜 Only: ${superHotDealOnly ? "ON" : "OFF"})`
        });
    } else if (subCommand == "cancel") {
        await removeCategoryFromChannel(channel.id, category);

        await interaction.reply({
            content: `구독 해지: <#${channel.id}> 채널에서 '${HotDealCategory[category]}'를 구독 해지합니다.`
        });
    } else {
        await interaction.reply({
            content: `Invalid sub command error: ${subCommand}`
        });
    }
}

const commands: Partial<SlashCommandBuilder>[] = [subscriptionCommand];

const commandHandlers: Record<string, ((interaction: ChatInputCommandInteraction) => Promise<void> | void)> = {
    subscription: subscriptionCommandHandler
};

export { commands, commandHandlers };
