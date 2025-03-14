import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import config from 'src/config';

@Injectable()
export class RedisService {
  private client;

  constructor() {
    this.client = createClient({
      url: config.REDIS_URL,
    });

    this.client.on('error', (err: any) => console.error('Redis Error:', err));

    this.client.connect();
  }

  async set(key: string, value: any, ttl = config.REDIS_TTL) {
    await this.client.set(key, JSON.stringify(value), { EX: ttl as number });
  }

  async get(key: string) {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async delete(key: string) {
    await this.client.del(key);
  }
}
