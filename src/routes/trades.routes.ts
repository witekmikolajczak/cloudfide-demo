import { Router } from 'express';
import {getAggregatedTrades} from "./trades.controller";

const router = Router();

router.post('/trades', getAggregatedTrades);

export default router;