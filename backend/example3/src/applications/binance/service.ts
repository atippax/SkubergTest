import { SymbolBinance } from "./interface"

function binanceSystemService() {
    const baseApiBinance = 'https://api.binance.com/api/v3'
    return {
        getAllSymbol: async () => {
            const binanceData = await fetch(`${baseApiBinance}/exchangeInfo`)
            const binanceToJson = ((await binanceData.json()).symbols) as SymbolBinance[]
            const result = binanceToJson.filter(x => x.quoteAsset == 'USDT').filter(x => x.status == 'TRADING').map(x => ({
                symbol: x.symbol,
                baseAsset: x.baseAsset,
                quoteAsset: x.quoteAsset,
            }))
            return result
        },
        getDetailSymbol: async (symbol: string) => {
            const binanceData = await fetch(`${baseApiBinance}/avgPrice?symbol=${symbol}`)
            const binanceToJson = ((await binanceData.json()))
            return binanceToJson
        }
    }
}
export type BinanceSystemService = ReturnType<typeof binanceSystemService>
export default binanceSystemService