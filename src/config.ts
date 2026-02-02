import dotenv from 'dotenv';
import zod from 'zod';

dotenv.config();

const schema = zod.object({
    PORT: zod.string()
})

export const config = schema.parse(process.env);