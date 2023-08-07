import { getHotDealList } from "arcalive-api";
import { getConfig } from "./store/config";
import { Categories } from "./type/ArcaLive";
import DealStore from "./store/deal";
import wait from "./util/wait";

let intervalInstance: NodeJS.Timer;
let latestRun: Date = new Date();

async function intervalJob() {
    for (const category of Categories) {
        await wait(1000);

        console.log(`Fetching deal: ${category}`);
        const dealList = await getHotDealList(1, {
            category
        }, {
            headers: getConfig().headers
        });
        console.log(`Deal fetched: ${dealList.map((d) => d.id)}`);

        await wait(1000);

        console.log(`Fetching hot deal: ${category}`);
        const hotDealList = await getHotDealList(1, {
            category, mode: "best"
        }, {
            headers: getConfig().headers
        });
        console.log(`Hot deal fetched: ${hotDealList.map((d) => d.id)}`);

        dealList.map((d) => DealStore.instance.addDeal(category, {
            ...d,
            category
        }));
        hotDealList.map((d) => DealStore.instance.addHotDeal(category, {
            ...d,
            category
        }));
    }
}

function renewLatestRun() {
    const now = new Date();
    const latest = latestRun;
    const diff = now.valueOf() - latestRun.valueOf();

    latestRun = now;

    return {
        latest, now, diff
    };
}

function startInterval() {
    const interval = getConfig().refreshInterval;

    console.log(`Start interval task: ${(interval / 1000).toFixed(2)} seconds.`);

    intervalInstance = setInterval(async () => {
        console.log("Run interval task.");
        const { latest, now, diff } = renewLatestRun();
        console.log(
            `Latest run: ${latest.toISOString()} / `
            + `Current run: ${now.toISOString()} / `
            + `Interval: ${(diff / 1000).toFixed(2)} sec.`
        );

        await intervalJob();
    }, interval);
}

function restartInterval() {
    clearInterval(intervalInstance);
    startInterval();
    console.log(`Restart interval task: every ${(getConfig().refreshInterval / 1000).toFixed(2)} seconds.`);
}

export { restartInterval, startInterval, intervalJob };
