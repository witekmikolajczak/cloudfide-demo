# cloudfide-demo

## To run
1) Clone repository: `git clone https://github.com/witekmikolajczak/cloudfide-demo`
2) Enter the project folder: `cd cloudfide-demo`
3) Create an `.env` file with the port:
   ```shell
   echo "PORT=3000" > .env
   ```
4) Install dependencies: `npm install`
5) Build: `npm run build`
6) Start: `npm start`

## Example request
Send a POST to `/trades` with JSON body:

```shell
curl -X POST http://localhost:${PORT:-3000}/trades \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "BTCUSDT",
    "from": "01/01/2009",
    "endTime": "01/02/2026"
  }'
```

If `.env` sets `PORT=3000`, the URL resolves to `http://localhost:3000/trades`.
