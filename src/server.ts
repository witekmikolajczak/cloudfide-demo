import express, {Request, Response} from 'express'
import {format, parse} from 'date-fns';

import {config} from "./config";
import {client} from "./client";
import {z} from "zod";

const app = express()

app.use(express.json())

app.use('/health', (_, res) => {
    res.json({status: 'ok'})
})

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

// type TradeRequestBody = {
//     symbol: string;
//     from: string;
//     endTime?: string;
// }

const SYMBOL = 'BTCUSDT'

/**
 * Convert a date string to timestamp
 * eg. 02/13/2009
 */
function toTimestamp(dateStr:string){
    return parse(dateStr, 'MM/dd/yyyy', new Date()).getTime();
}

const schema = z.object({
    symbol: z.string(),
    from: z.string(),
    endTime: z.string().optional()
})

type TradeRequest = z.infer<typeof schema>

app.post('/trades' , async (req: Request,res: Response) => {
    try{
        const {symbol, from, endTime} = req.body as TradeRequest;

        //Validate input
        schema.parse({symbol, from, endTime})

        const startTimestamp= toTimestamp(from);
        const endTimestamp= endTime ? toTimestamp(endTime): Date.now();

        console.log('Date ', format(startTimestamp, 'MM/dd/yyyy'))

        const aggTradesResponse = await client.get<AggTradesResponse[]>('/api/v3/aggTrades',
            {params: {
                    symbol,
                    startTime: startTimestamp,
                    endTime: endTimestamp,
                    limit: 500,
            }}
        )

        if(aggTradesResponse.status !== 200) {
            res.status(aggTradesResponse.status).send(aggTradesResponse.data)
        }

        const lowestPrice = aggTradesResponse.data.reduce((acc, trade) => Math.min(acc, Number(trade.p)), Number.MAX_SAFE_INTEGER)
        const highestPrice = aggTradesResponse.data.reduce((acc, trade) => Math.max(acc, Number(trade.p)), Number.MIN_SAFE_INTEGER)
        const priceChangeInPercentage = ((highestPrice - lowestPrice) / lowestPrice) * 100

        console.log('Lowest Price: ', lowestPrice, '\nHighest Price: ', highestPrice, ' \nPrice Change: ', priceChangeInPercentage, '%')

        const result = {
            symbol,
            lowestPrice,
            highestPrice,
            priceChangeInPercentage,
            from,
            endTime: format(endTimestamp, 'MM/dd/yyyy')
        }
        // const result = aggTradesResponse.data.map(trade => ({...trade, T: format(trade.T, 'MM/dd/yyyy')}))

        res.json(result)
    }catch(e){
        console.error('[Controller Error] Something went wrong', e)
        res.status(500).send({
            message: 'Something went wrong'
        })
    }
})

function main() {
    app.listen(config.PORT, () => console.log(`Server is running on port ${config.PORT}!`))
}

main()