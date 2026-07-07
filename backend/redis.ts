import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  console.warn("Redis Client Error:", err.message || err);
});

redisClient.on("connect", () => {
  console.log("Redis client connected successfully.");
});

export async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.warn("Could not connect to Redis. Running without caching support.");
  }
}
