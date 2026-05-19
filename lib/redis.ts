import { Redis } from '@upstash/redis'

// Initialize the Redis client. 
// It will automatically use UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN 
// from the environment variables.
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})
