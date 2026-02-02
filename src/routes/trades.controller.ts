import {Request, Response} from 'express'

import {z} from "zod";
import {fetchAggTradesFromBinance} from "./trades.services";

const schema = z.object({
    symbol: z.string(),
    from: z.string(),
    endTime: z.string().optional()
})

type TradeRequest = z.infer<typeof schema>


export const getAggregatedTrades = async (req: Request, res: Response) => {
    try{
        const {symbol, from, endTime} = req.body as TradeRequest;

        //Validate input
        schema.parse({symbol, from, endTime})

        const result = await fetchAggTradesFromBinance({symbol, startTime: from, endTime})

        res.json(result)
    }catch(e){
        console.error('[Controller Error] Something went wrong', e)
        res.status(500).send({
            message: 'Something went wrong'
        })
    }
}