import DealStore from "./deal";
import { getDeals } from "../arca";
import { getConfig, loadConfig } from "./config";

test("store/deal::DealStore - add deal", async () => {
    expect.assertions(1);
    const store = DealStore.instance;
    await loadConfig();
    const deals = await getDeals({category: "pc"}, getConfig().headers);

    deals.map(d => {
        store.addDeal("pc", {
            ...d, category: "pc"
        });
    });

    expect(store.getDeals("pc")).toHaveLength(40);
});

test("store/deal::DealStore - add hot deal", async () => {
    expect.assertions(1);
    const store = DealStore.instance;
    await loadConfig();

    const hotDeals = await getDeals({category: "pc", mode: "best"}, getConfig().headers);

    hotDeals.map(d => {
        store.addHotDeal("pc", {
            ...d, category: "pc"
        });
    });

    expect(store.getHotDeals("pc")).toHaveLength(40);
});

