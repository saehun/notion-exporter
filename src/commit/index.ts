import * as chalk from 'chalk';
import * as path from 'path';
import { repoPath } from '../env';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as execa from 'execa';
const rimraf = require('rimraf');

export async function commit({
  exported,
  content,
  meta,
}: {
  exported: string;
  content: string;
  meta: Record<string, any>;
}): Promise<any> {
  if (typeof meta.key !== 'string' || meta.key.length > 8) {
    throw new Error(`Invalid meta data:
 ${JSON.stringify(meta, undefined, 2)}`);
  }
  console.log(chalk.yellowBright('[3/3] Commit'));
  const basedir = path.join(os.homedir(), repoPath);
  const filename = encodeURI(meta.key.replace(/\s/g, '-'));

  await Promise.all([
    fs.writeFile(content, path.join(basedir, filename + 'md')),
    fs.writeFile(
      JSON.stringify(meta, undefined, 2),
      path.join(basedir, filename + 'json')
    ),
  ]);

  // TODO find git root
  const workdir = path.join(basedir, '..');
  process.chdir(workdir);
  await execa('git', ['add', '.'], { stdio: 'inherit' });
  await execa('git', ['commit', '-m', 'add document'], { stdio: 'inherit' });
  await execa('git', ['push', 'origin', 'master']);

  rimraf.sync(exported);
  rimraf.sync(exported + '.zip');
}
