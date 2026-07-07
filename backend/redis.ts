import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

// If REDIS_URL is not set in production, bypass client creation/connection to avoid log spamming
export const redisClient = redisUrl ? createClient({ url: redisUrl }) : null;

if (redisClient) {
  redisClient.on("error", (err) => {
    console.warn("Redis Client Error:", err.message || err);
  });

  redisClient.on("connect", () => {
    console.log("Redis client connected successfully.");
  });
}

export async function connectRedis() {
  if (!redisClient) {
    console.log("Redis URL not configured. Running without caching.");
    return;
  }
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.warn("Could not connect to Redis. Running without caching support.");
  }
}
