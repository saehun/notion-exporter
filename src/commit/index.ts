import * as chalk from 'chalk';
import * as os from 'os';
import * as path from 'path';
import { repoPath } from '../env';
import { printer } from '../notion/printer';
import { gitcommit } from './git';
import { clear, writeFile } from './file';
import { validateMeta } from './validate';

export async function commit({
  exported,
  content,
  meta,
}: {
  exported: string;
  content: string;
  meta: Record<string, any>;
}): Promise<any> {
  console.log(chalk.yellowBright('[3/3] Commit'));
  const print = printer();

  print.start('validate meta data');
  validateMeta(meta);
  const basedir = path.join(os.homedir(), repoPath);
  const filename = encodeURI(meta.key.replace(/\s/g, '-'));

  print.step(`write document '${filename}'`);
  await writeFile(basedir, filename, meta, content);
  print.step('commit to git repository');
  await gitcommit(basedir, filename);

  print.step('clear tmp files and directories');
  clear(exported);
  print.done();
}
