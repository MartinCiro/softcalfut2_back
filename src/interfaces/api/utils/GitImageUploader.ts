import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import simpleGit from 'simple-git';
import config from '@src/config';

const USER_NAME = config.USERNAME_GIT as string;
const CLONE_DIR = join(__dirname, '..', '..', 'tmp', 'repo-img');

const REPO = config.REPO_IMG!.split(':')[1].replace('.git', '')

const REPO_URL = `https://${USER_NAME}:${config.TOKEN_AUTH_GIT}@github.com/${REPO}.git` 

const branch = config.BRANCH_IMG as string

export class GitImageUploader {
  private static gitInstance: ReturnType<typeof simpleGit> | null = null;
  private static initialized = false;

  private static async initialize() {
    if (!existsSync(CLONE_DIR)) {
      mkdirSync(CLONE_DIR, { recursive: true });
      await simpleGit().clone(REPO_URL, CLONE_DIR);
    }

    this.gitInstance = simpleGit(CLONE_DIR);

    // Configuraciones que solo necesitan hacerse una vez
    await this.gitInstance
      .addConfig('user.name', USER_NAME, false, 'local')
      .addConfig('user.email', config.EMAIL_GIT as string, false, 'local');

    this.initialized = true;
  }

  static async subirImagen(nombreArchivo: string, buffer: Buffer): Promise<string> {
    if (!this.initialized) await this.initialize();
    if (!this.gitInstance) throw new Error('Git instance not initialized');

    // Resetear cualquier cambio local y obtener los últimos cambios del remoto
    await this.gitInstance
      .fetch('origin', branch)  // Primero obtenemos las referencias más recientes
      .reset(['--hard', `origin/${branch}`])  // Reset duro al estado del remoto
      .pull('origin', branch);  // Asegurarnos de tener todo lo último

    // Operaciones con archivos
    const rutaFinal = join(CLONE_DIR, 'imagenes', nombreArchivo);
    mkdirSync(join(CLONE_DIR, 'imagenes'), { recursive: true });
    writeFileSync(rutaFinal, buffer);

    // Git operations
    await this.gitInstance
      .add('./*')
      .commit(`add image ${nombreArchivo}`)
      .push('origin', branch);

    return `https://raw.githubusercontent.com/${REPO}/${branch}/imagenes/${nombreArchivo}`;
  }
}