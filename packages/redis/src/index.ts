import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: Redis | null = null;

const configOptions = {
    port: parseInt(process.env.REDIS_PORT || '6379'),
    host: process.env.REDIS_HOST || '127.0.0.1',
    // password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0'),
    maxRetriesPerRequest: 3,
    reconnectOnError: () => true,
}

export const getRedisClient = (): Redis => {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(configOptions);

  redisClient.on('connect', () => {
    console.log('✅ Redis connected');
  });

  redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
  });

  return redisClient;
};
