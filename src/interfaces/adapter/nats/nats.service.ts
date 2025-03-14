// interface/adapter/nats/nats.service.ts
import { Injectable } from '@nestjs/common';
import { connect, NatsConnection } from 'nats';
import { MessagingPort } from 'core/port/messaging-port';
import config from 'src/config';

@Injectable()
export class NatsService implements MessagingPort {
  private ncPromise: Promise<NatsConnection>;

  constructor() {
    this.ncPromise = connect({ servers: config.NATS_URL });
  }

  async publish(subject: string, data: any): Promise<void> {
    const nc = await this.ncPromise;
    nc.publish(subject, new TextEncoder().encode(JSON.stringify(data)));
  }

  async subscribe(subject: string, callback: (data: any) => void): Promise<void> {
    const nc = await this.ncPromise;
    const sub = nc.subscribe(subject);
    for await (const msg of sub) {
      callback(JSON.parse(new TextDecoder().decode(msg.data)));
    }
  }
}
