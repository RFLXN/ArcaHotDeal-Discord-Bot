import { getHotDealList, ListFetchOption } from "arcalive-api";

async function getDeals(option: ListFetchOption, headers: Record<string, string>) {
    return getHotDealList(1, option, {
        headers
    });
}

export { getDeals };
