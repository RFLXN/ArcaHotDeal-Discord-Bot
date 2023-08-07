import { EmbedBuilder, TextChannel } from "discord.js";
import { Deal, HotDealCategory } from "./type/ArcaLive";
import DealStore from "./store/deal";
import { getChannels } from "./store/channel";
import { getClient } from "./store/client";
import wait from "./util/wait";

function createEmbed(deal: Deal): EmbedBuilder {
    const builder = new EmbedBuilder();

    builder.setTitle(`[${HotDealCategory[deal.category]}] ${deal.title}`)
        .setURL(deal.url)
        .setThumbnail(deal.thumbnailUrl)
        .setAuthor({ name: deal.store })
        .setDescription(`할인가: ${deal.price} 원\n배송비: ${deal.delivery == 0 ? "무료" : `${deal.delivery} 원`}`);

    return builder;
}

async function fetchChannel(channelId: string) {
    console.log(`Fetching channel: ${channelId}`);
    const channel = await getClient().channels.fetch(channelId);

    if (!channel?.isTextBased()) {
        throw new Error();
    }

    return channel as TextChannel;
}

async function send(channelId: string, deal: Deal) {
    const channel = await fetchChannel(channelId);

    console.log(`Send message: ${deal.title} (${deal.id}) to ${channel.name} (${channelId})`);
    const embed = createEmbed(deal);
    await channel.send({ embeds: [embed] });
}

async function sendDeal(deal: Deal) {
    for (const channel of getChannels()) {
        if (channel.categories[deal.category] == "hot") {
            await send(channel.channelId, deal);
            await wait(500);
        }
    }
}

async function sendHotDeal(deal: Deal) {
    for (const channel of getChannels()) {
        if (channel.categories[deal.category] == "hot") {
            await send(channel.channelId, deal);
            await wait(500);
        }
    }
}

function registerSend() {
    DealStore.instance.onDealAdded(sendDeal);
    DealStore.instance.onHotDealAdded(sendHotDeal);
}

export { registerSend };
