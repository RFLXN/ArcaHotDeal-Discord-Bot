import EventEmitter from "events";
import { Categories, CategoryKey, Deal } from "../type/ArcaLive";

const MAX_STACK = 40;

class DealStore extends EventEmitter {
    private static readonly ins = new DealStore();

    private readonly deals: Map<CategoryKey, Deal[]> = new Map();

    private readonly hotDeals: Map<CategoryKey, Deal[]> = new Map();

    private constructor() {
        super();

        this.initDealStores();
    }

    public static get instance() {
        return this.ins;
    }

    private initDealStores() {
        Categories.map((category) => {
            this.deals.set(category, []);
            this.hotDeals.set(category, []);
        });
    }

    private findDeal(category: CategoryKey, dealId: number) {
        return this.deals.get(category)?.find((deal) => deal.id == dealId);
    }

    private findHotDeal(category: CategoryKey, dealId: number) {
        return this.hotDeals.get(category)?.find((deal) => deal.id == dealId);
    }

    private findDealIdx(category: CategoryKey, deal: Deal) {
        return this.deals.get(category)?.findIndex((d) => deal.id == d.id);
    }

    private findHotDealIdx(category: CategoryKey, deal: Deal) {
        return this.hotDeals.get(category)?.findIndex((d) => deal.id == d.id);
    }

    public addDeal(category: CategoryKey, deal: Deal) {
        const find = this.findDeal(category, deal.id);
        if (!find) {
            let list = this.deals.get(category) as Deal[];
            list.push(deal);

            if (list.length > MAX_STACK) {
                list = this.removeFirst(list);
            }

            this.deals.set(category, list);
            this.emit("HOT_DEAL_ADDED", deal);
        }
    }

    public addHotDeal(category: CategoryKey, deal: Deal) {
        const find = this.findHotDeal(category, deal.id);
        if (!find) {
            let list = this.hotDeals.get(category) as Deal[];
            list.push(deal);

            if (list.length > MAX_STACK) {
                list = this.removeFirst(list);
            }

            this.hotDeals.set(category, list);
            this.emit("HOT_DEAL_ADDED", deal);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    private removeFirst(list: Deal[]) {
        const l = list;
        l.splice(0, 1);
        return l;
    }

    public onDealAdded(listener: (deal: Deal) => void) {
        this.on("DEAL_ADDED", listener);
    }

    public onHotDealAdded(listener: (deal: Deal) => void) {
        this.on("HOT_DEAL_ADDED", listener);
    }

    public getDeals(category: CategoryKey) {
        return this.deals.get(category);
    }

    public getHotDeals(category: CategoryKey) {
        return this.hotDeals.get(category);
    }
}

export default DealStore;
