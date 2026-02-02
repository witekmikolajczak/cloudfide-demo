import dotenv from 'dotenv';
import zod from 'zod';

dotenv.config();

const schema = zod.object({
    PORT: zod.string().default('3000'),
    BINANCE_API_URL: zod.string().url().default('https://api.binance.com')
})

console.log('[Config] Loaded env variables: ', schema.parse(process.env))

export const config = schema.parse(process.env);
