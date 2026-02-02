import express, {Request, Response} from 'express'

import tradesRoutes from "./routes/trades.routes";
import {config} from "./config";


const app = express()

app.use(express.json())

app.use('/health', (_, res) => {
    res.json({status: 'ok'})
})


app.use(tradesRoutes);

function main() {
    app.listen(config.PORT, () => console.log(`Server is running on port ${config.PORT}!`))
}

main()