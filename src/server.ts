import express from 'express'

import tradesRoutes from "./routes/trades.routes";
import {config} from "./config";


const app = express()

app.use(express.json())

app.use('/health', (_, res) => {
    res.json({status: 'ok'})
})


app.use(tradesRoutes);

function main() {
    app.listen(config.PORT, () => console.log(`[Server] Server is running on port http://localhost:${config.PORT}!`))
}

main()