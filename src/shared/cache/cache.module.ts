import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisService],
  exports: [RedisService] // 👈 Exportamos para que otros módulos puedan usarlo
})
export class CacheModule {}
