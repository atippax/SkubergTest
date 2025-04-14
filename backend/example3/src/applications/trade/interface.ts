export interface SymbolFilter {
    filterType:
    | "PRICE_FILTER"
    | "LOT_SIZE"
    | "ICEBERG_PARTS"
    | "MARKET_LOT_SIZE"
    | "TRAILING_DELTA"
    | "PERCENT_PRICE_BY_SIDE"
    | "NOTIONAL"
    | "MAX_NUM_ORDERS"
    | "MAX_NUM_ALGO_ORDERS";
    minPrice?: string;
    maxPrice?: string;
    tickSize?: string;

    minQty?: string;
    maxQty?: string;
    stepSize?: string;

    limit?: number;

    minTrailingAboveDelta?: number;
    maxTrailingAboveDelta?: number;
    minTrailingBelowDelta?: number;
    maxTrailingBelowDelta?: number;

    bidMultiplierUp?: string;
    bidMultiplierDown?: string;
    askMultiplierUp?: string;
    askMultiplierDown?: string;
    avgPriceMins?: number;

    minNotional?: string;
    applyMinToMarket?: boolean;
    maxNotional?: string;
    applyMaxToMarket?: boolean;

    maxNumOrders?: number;
    maxNumAlgoOrders?: number;
}

export interface SymbolBinance {
    symbol: string;
    status: string;
    baseAsset: string;
    baseAssetPrecision: number;
    quoteAsset: string;
    quotePrecision: number;
    quoteAssetPrecision: number;
    baseCommissionPrecision: number;
    quoteCommissionPrecision: number;
    orderTypes: string[];
    icebergAllowed: boolean;
    ocoAllowed: boolean;
    otoAllowed: boolean;
    quoteOrderQtyMarketAllowed: boolean;
    allowTrailingStop: boolean;
    cancelReplaceAllowed: boolean;
    isSpotTradingAllowed: boolean;
    isMarginTradingAllowed: boolean;
    filters: SymbolFilter[];
    permissions: string[];
    permissionSets: string[][];
    defaultSelfTradePreventionMode: string;
    allowedSelfTradePreventionModes: string[];
}
