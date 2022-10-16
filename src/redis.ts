import Redis from "ioredis";
import { getRedisOptions } from "./blog/constants/redis";

export const redis = new Redis(getRedisOptions());
