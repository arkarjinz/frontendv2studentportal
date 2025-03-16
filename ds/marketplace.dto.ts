export type MarketplaceItemDto = {
    id?: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
    imageBase64?: string;
    category: string;
};

export type ExchangeHistoryDto = {
    id?: number;
    itemName: string;
    quantityExchanged: number;
    totalRosesSpent: number;
    exchangeDate: string;
};
