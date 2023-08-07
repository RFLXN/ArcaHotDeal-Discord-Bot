import { CategoryKey } from "./ArcaLive";

type Mode = "none" | "hot" | "deal";

type ChannelCategories = Record<CategoryKey, Mode>;

interface Channel {
    channelId: string;
    categories: ChannelCategories
}

export { Channel, Mode, ChannelCategories };
