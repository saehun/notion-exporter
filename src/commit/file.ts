import * as fs from 'fs-extra';
import * as path from 'path';
const rimraf = require('rimraf');

export async function writeFile(
  basedir: string,
  filename: string,
  meta: Record<string, string>,
  content: string
): Promise<void> {
  await Promise.all([
    fs.outputFile(path.join(basedir, meta.target, filename + '.md'), content),
    fs.outputFile(
      path.join(basedir, meta.target, filename + '.json'),
      JSON.stringify(meta, undefined, 2)
    ),
  ]);
}

export function clear(exported: string): void {
  rimraf.sync(exported);
  rimraf.sync(exported + '.zip');
}
