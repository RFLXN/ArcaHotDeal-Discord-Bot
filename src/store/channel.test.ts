import { resolve } from "path";
import { rm } from "fs/promises";
import { addCategoryToChannel, getChannels, loadChannel, removeCategoryFromChannel } from "./channel";
import { Channel } from "../type/channel";

const CHANNEL_PATH = resolve(__dirname, "..", "..", "resource", "channel.json");

async function removeChannelFile() {
    try {
        await rm(CHANNEL_PATH);
    } catch (ignore) {}
}

async function defaultJob() {
    await removeChannelFile();
    await loadChannel();
}

test("store/channel::addCategoryToChannel - add categories (pc:deal, sw:hot)", async () => {
    expect.assertions(1);
    await defaultJob();

    await addCategoryToChannel("123", "pc", true);
    await addCategoryToChannel("123", "pc", false);
    await addCategoryToChannel("123", "sw", true);

    const channel = getChannels();

    const expectedResult: Channel = {
        channelId: "123",
        categories: {
            pc: "deal",
            sw: "hot",
            food: "none",
            living: "none",
            elec: "none",
            wear: "none",
            cosmetic: "none",
            etc: "none",
            gift: "none"
        }
    }

    expect(channel[0]).toEqual(expectedResult);
});

test("store/channel::removeCategoryFromChannel - remove category (pc:deal, sw:none)", async () => {
    expect.assertions(1);
    await defaultJob();

    await addCategoryToChannel("123", "pc", true);
    await addCategoryToChannel("123", "pc", false);
    await addCategoryToChannel("123", "sw", true);
    await removeCategoryFromChannel("123", "sw");

    const channel = getChannels();

    const expectedResult: Channel = {
        channelId: "123",
        categories: {
            pc: "deal",
            sw: "none",
            food: "none",
            living: "none",
            elec: "none",
            wear: "none",
            cosmetic: "none",
            etc: "none",
            gift: "none"
        }
    }

    expect(channel[0]).toEqual(expectedResult);
})
