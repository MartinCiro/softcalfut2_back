import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';
import config from '@src/config';

const SSH_KEY_PATH = path.join(os.homedir(), '.ssh', 'id_rsa');
const SSH_PUB_KEY_PATH = SSH_KEY_PATH + '.pub';

function sshKeyExists() {
  return fs.existsSync(SSH_KEY_PATH) && fs.existsSync(SSH_PUB_KEY_PATH);
}

function createSSHKey() {
  console.log('🔑 Generando clave SSH...');
  execSync(`ssh-keygen -t rsa -b 4096 -C "${config.EMAIL_GIT}" -f ${SSH_KEY_PATH} -N ""`, { stdio: 'inherit' });
}

async function uploadKeyToGitHub() {
  const publicKey = fs.readFileSync(SSH_PUB_KEY_PATH, 'utf8');

  const res = await fetch('https://api.github.com/user/keys', {
    method: 'POST',
    headers: {
      'Authorization': `token ${config.TOKEN_AUTH_GIT}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: config.TITLE_TOKEN_AUTH,
      key: publicKey,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('❌ Error subiendo la clave SSH a GitHub:', error);
  } else {
    console.log('✅ Clave SSH subida exitosamente a GitHub');
  }
}

export async function ensureSSHKey() {
  if (!sshKeyExists()) {
    createSSHKey();
    await uploadKeyToGitHub();
  } else {
    console.log('✔️ Clave SSH ya existe');
  }
}


