import { Categories } from "./ArcaLive";

test("type/ArcaLive::Categories - traverse all HotDealCategory keys", () => {
    expect(Categories).toEqual([
        "living", "food", "pc", "sw", "elec", "wear", "cosmetic", "gift", "etc"
    ]);
});
