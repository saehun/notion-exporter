import * as execa from 'execa';
const dirTree = require('directory-tree');
const rimraf = require('rimraf');

export async function unzip(filename: string): Promise<void> {
  rimraf.sync(filename);
  await execa('ditto', [
    '-V',
    '-x',
    '-k',
    '--sequesterRsrc',
    '--rsrc',
    filename + '.zip',
    filename,
  ]);
}
