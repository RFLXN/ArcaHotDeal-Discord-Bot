enum HotDealCategory {
    living = "생활용품",
    food = "식품",
    pc = "PC/하드웨어",
    sw = "SW/게임",
    elec = "전자제품",
    wear = "의류",
    cosmetic = "화장품",
    gift = "상품권",
    etc = "기타"
}

type CategoryKey = keyof typeof HotDealCategory;

const Categories = Object.keys(HotDealCategory) as CategoryKey[];

interface Deal {
    id: number;
    title: string;
    price: number;
    delivery: number;
    store: string;
    category: CategoryKey;
    thumbnailUrl: string;
    url: string;
}

export {
    HotDealCategory, Categories, CategoryKey, Deal
};
