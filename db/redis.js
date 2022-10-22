const { createClient } = require("redis");
require("dotenv").config();
const redis = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
redis.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  try {
    await redis.connect();
    console.log("Successfully connected to redis client");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { redis, connectRedis };
