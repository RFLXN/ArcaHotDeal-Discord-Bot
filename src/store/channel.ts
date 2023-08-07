import { resolve } from "path";
import { Channel, ChannelCategories } from "../type/channel";
import { loadJson, writeJson } from "../util/json";
import { isFileExist } from "../util/file";
import { Categories, CategoryKey } from "../type/ArcaLive";

const CHANNEL_PATH = resolve(__dirname, "..", "..", "resource", "channel.json");

let channelStore: Channel[] = [];

async function isChannelFileExist() {
    return isFileExist(CHANNEL_PATH);
}
async function loadChannel() {
    if (await isChannelFileExist()) {
        channelStore = await loadJson<Channel[]>(CHANNEL_PATH);
    } else {
        await writeJson(CHANNEL_PATH, []);
    }
    return channelStore;
}

function getChannels() {
    return channelStore;
}

function isExistChannel(channelId: string) {
    const has = channelStore.find((channel) => channel.channelId == channelId);

    return !!has;
}

function getIdxById(channelId: string) {
    return channelStore.findIndex((channel) => channel.channelId == channelId);
}

function initCategories(): ChannelCategories {
    const categories: Partial<ChannelCategories> = {};
    Categories.map((category) => { categories[category] = "none"; });

    return categories as ChannelCategories;
}

async function addCategoryToChannel(channelId: string, category: CategoryKey, best: boolean) {
    if (isExistChannel(channelId)) {
        const idx = getIdxById(channelId);
        channelStore[idx].categories[category] = best ? "hot" : "deal";
    } else {
        const c = initCategories();
        c[category] = best ? "hot" : "deal";

        channelStore.push({
            channelId, categories: c
        });
    }

    await writeJson(CHANNEL_PATH, channelStore);
}

async function removeCategoryFromChannel(channelId: string, category: CategoryKey) {
    if (!isExistChannel(channelId)) return;

    const idx = getIdxById(channelId);
    channelStore[idx].categories[category] = "none";

    await writeJson(CHANNEL_PATH, channelStore);
}

export {
    loadChannel, getChannels, addCategoryToChannel, removeCategoryFromChannel
};
