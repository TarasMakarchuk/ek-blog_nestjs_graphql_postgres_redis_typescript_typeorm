export const getRedisOptions = () => {
    return {
        url: process.env.REDIS_TLS_URL,
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        ...(process.env.REDIS_USE_TLS === '1' ? { tls: { rejectUnauthorized: false } } : {}),
    }
};
