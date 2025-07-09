import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import simpleGit from 'simple-git';
import config from 'src/config';

const REPO_URL = "git@github.com:MartinCiro/imagesSoftcalfut.git";
const CLONE_DIR = join(__dirname, '..', '..', 'tmp', 'repo-img');

export class GitImageUploader {
  static async subirImagen(nombreArchivo: string, buffer: Buffer): Promise<string> {
    const git = simpleGit();
    
    // Si no existe el directorio local, clónalo
    if (!existsSync(CLONE_DIR)) await git.clone(REPO_URL, CLONE_DIR);
    const gitRepo = simpleGit(CLONE_DIR);
    
    const rutaFinal = join(CLONE_DIR, 'imagenes', nombreArchivo);
    mkdirSync(join(CLONE_DIR, 'imagenes'), { recursive: true });
    writeFileSync(rutaFinal, buffer);
    
    // Commit y push
    await gitRepo.add('./*');
    await gitRepo.commit(`add image ${nombreArchivo}`);
    const remotes = await gitRepo.getRemotes(true);
    console.log(remotes);
    await gitRepo.push('origin', 'main');

    // Construir URL pública (si el repo es público)
    const repoPath = config.REPO_IMG.split(':')[1].replace('.git', '');
    const rawURL = `https://raw.githubusercontent.com/${repoPath}/main/imagenes/${nombreArchivo}`;
    return rawURL;
  }
}
