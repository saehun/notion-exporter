import * as execa from 'execa';
import * as path from 'path';

export async function gitcommit(basedir: string, filename: string): Promise<void> {
  // TODO find git root
  const workdir = path.join(basedir, '..');
  process.chdir(workdir);
  await execa('git', ['pull', 'origin', 'master']);
  await execa('git', ['add', '.']);
  await execa('git', ['commit', '-m', `add ${filename}`]);
  await execa('git', ['push', 'origin', 'master']);
}
