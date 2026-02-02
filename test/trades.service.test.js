import { expect } from 'chai';
import nock from 'nock';
import axios from 'axios';
import {fetchBinanceData} from "../src/routes/trades.services";

const mockedBinanceResponse = [
    {
        a: 1489932789,
        p: '20133.12000000',
        q: '0.01000000',
        f: 1741119010,
        l: 1741119010,
        T: 1662076801326,
        m: false,
        M: true
    },
    {
        a: 1489932790,
        p: '20133.19000000',
        q: '0.13806000',
        f: 1741119011,
        l: 1741119011,
        T: 1662076801326,
        m: false,
        M: true
    },
    {
        a: 1489932791,
        p: '20133.20000000',
        q: '0.10226000',
        f: 1741119012,
        l: 1741119012,
        T: 1662076801326,
        m: false,
        M: true
    },
]
const PATH_TO_MOCK= '/api/v3/aggTrades'
describe('Binance API client', () => {
    const base = 'https://api.binance.com';

    beforeEach(() => {
        nock(base)
            .get(PATH_TO_MOCK)
            .query({ symbol: 'BTCUSDT' })
            .reply(200, mockedBinanceResponse);
    });

    afterEach(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });

    it('returns mocked price', async () => {
        const response = await fetchBinanceData({
            symbol: 'BTCUSDT',
            startTime: 1662076801326,
            endTime: Date.now()
        })

        console.log('RES: ',res)
        const res = await axios.get(`${base}/api/v3/ticker/price`, {
            params: { symbol: 'BTCUSDT' },
        });

        expect(res.status).to.equal(200);
        expect(res.data).to.deep.equal({ symbol: 'BTCUSDT', price: '42000.00' });
    });
});



