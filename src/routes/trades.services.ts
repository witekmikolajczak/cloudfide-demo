import {format, parse} from "date-fns";
import {client} from "../client";

type Params = {
    symbol: string,
    startTime: string,
    endTime?: string | undefined,
}

type AggTradesResponse = {
    a: number, // Aggregate tradeId
    p: string, // Price
    q: string, // Quantity
    f: number, // First tradeId
    l: number, // Last tradeId
    T: number, // Timestamp
    m: boolean, // Was the buyer the maker?
    M: boolean
}

type LowestAndHighestPrice = {
    lowestPrice: number,
    highestPrice: number,
    priceChangeInPercentage: number
}

/**
 * Convert a date string to timestamp
 * eg. 02/13/2009
 */
function toTimestamp(dateStr:string){
    return parse(dateStr, 'MM/dd/yyyy', new Date()).getTime();
}

const fetchBinanceData = async ({symbol, startTime, endTime}: Params):Promise<AggTradesResponse[]> => {
    try{
        const startTimestamp= toTimestamp(startTime);
        const endTimestamp= endTime ? toTimestamp(endTime): Date.now();

        const aggTradesResponse = await client.get<AggTradesResponse[]>('/api/v3/aggTrades',
            {params: {
                    symbol,
                    startTime: startTimestamp,
                    endTime: endTimestamp,
                    limit: 500,
                }}
        )

        if(aggTradesResponse.status !== 200) throw new Error(
            `Error fetching aggTrades for symbol ${symbol} from ${startTime} to ${endTime}`
        )

        return aggTradesResponse.data;
    }catch(e){
        console.error('[Binance Data] Something went wrong', e)
        throw e
    }
}

const getLowestAndHighestPrice = (data: AggTradesResponse[]): LowestAndHighestPrice => {
    const lowestPrice = data.reduce((acc, trade) => Math.min(acc, Number(trade.p)), Number.MAX_SAFE_INTEGER)
    const highestPrice = data.reduce((acc, trade) => Math.max(acc, Number(trade.p)), Number.MIN_SAFE_INTEGER)
    const priceChangeInPercentage = ((highestPrice - lowestPrice) / lowestPrice) * 100

    return {lowestPrice, highestPrice, priceChangeInPercentage}
}

export const fetchAggTradesFromBinance = async (
    {symbol, startTime, endTime}:Params
) => {
    const binanceAggDataResponse = await fetchBinanceData({symbol, startTime, endTime});
    const {lowestPrice, highestPrice, priceChangeInPercentage} = getLowestAndHighestPrice(binanceAggDataResponse)

    console.log('Lowest Price: ', lowestPrice, '\nHighest Price: ', highestPrice, ' \nPrice Change: ', priceChangeInPercentage, '%')

    return {
        symbol,
        lowestPrice,
        highestPrice,
        priceChangeInPercentage,
        from: startTime,
        endTime: format(endTime ? toTimestamp(endTime): Date.now(), 'MM/dd/yyyy')
    }

}