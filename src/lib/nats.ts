import { connect, NatsConnection } from 'nats';

let nc: NatsConnection | null = null;

export async function connectToNATS() {
    if (!nc) {
        nc = await connect({ servers: 'nats://localhost:4222' });
    }
    return nc;
}
