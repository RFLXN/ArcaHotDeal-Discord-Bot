import { getDeals } from "./arca";
import { getConfig, loadConfig } from "./store/config";

test("arca::getDeal - length of pc deals will be 45", async () => {
    expect.assertions(1);
    await loadConfig();
    const deals = await getDeals({category: "pc"}, getConfig().headers);
    expect(deals).toHaveLength(45);
})
