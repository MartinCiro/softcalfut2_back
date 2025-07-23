import { Logger } from '@nestjs/common';
import createApp from './app';
import config from './config';
import { ensureSSHKey } from './core/git/ensureSSHKey';

const port = config.port || 3000;

async function bootstrap() {
  await ensureSSHKey();
  const app = await createApp;
  await app.listen(port);
  Logger.log(`🚀 Server is running on http://localhost:${port}`);
}

bootstrap();
