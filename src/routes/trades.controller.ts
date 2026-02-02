import {Request, Response} from 'express'
import {z} from "zod";
import {fetchAggTradesFromBinance} from "./trades.services";

const schema = z.object({
    symbol: z.string(),
    from: z.string(),
    endTime: z.string().optional(),
    //Default limit is 500 and max is 1000
    limit: z.number().min(1).max(1000).optional()
})

type TradeRequest = z.infer<typeof schema>


export const getAggregatedTrades = async (req: Request, res: Response) => {
    try{
        //Validate input
        schema.parse(req.body)

        const {symbol, from, endTime, limit} = req.body as TradeRequest;

        const result = await fetchAggTradesFromBinance({symbol, startTime: from, endTime, limit})

        res.json(result)
    }catch(e){
        console.error('[Controller Error] Something went wrong', e)
        res.status(500).send({
            message: 'Something went wrong',
            cause: e
        })
    }
}