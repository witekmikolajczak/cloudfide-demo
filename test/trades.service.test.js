// Enable TypeScript imports in tests
require('ts-node/register');

const { expect } = require('chai');
const nock = require('nock');
const { fetchBinanceData } = require('../src/routes/trades.services');

const mockedBinanceResponse = [
  {
    a: 1489932789,
    p: '20133.12000000',
    q: '0.01000000',
    f: 1741119010,
    l: 1741119010,
    T: 1662076801326,
    m: false,
    M: true,
  },
  {
    a: 1489932790,
    p: '20133.19000000',
    q: '0.13806000',
    f: 1741119011,
    l: 1741119011,
    T: 1662076801326,
    m: false,
    M: true,
  },
  {
    a: 1489932791,
    p: '20133.20000000',
    q: '0.10226000',
    f: 1741119012,
    l: 1741119012,
    T: 1662076801326,
    m: false,
    M: true,
  },
];

const PATH_TO_MOCK = '/api/v3/aggTrades';
const BASE_URL = 'https://api.binance.com';

describe('Binance API client', () => {
  beforeEach(() => {
    nock(BASE_URL)
      .get(PATH_TO_MOCK)
      .query((q) => q.symbol === 'BTCUSDT')
      .reply(200, mockedBinanceResponse);
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('returns mocked aggTrades data', async () => {
    const res = await fetchBinanceData({
      symbol: 'BTCUSDT',
      startTime: '02/02/2026',
      endTime: '02/03/2026',
    });

    expect(res).to.deep.equal(mockedBinanceResponse);
  });
});


