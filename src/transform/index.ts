import * as chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';
import { extractMeta } from './extractMeta';
import { interpolate } from './interpolate';
import { DirItem } from './types';
import { unzip } from './unzip';
import { uploadToS3 } from './uploadToS3';
import { printer } from '../notion/printer';
const dirTree = require('directory-tree');
const rimraf = require('rimraf');

export async function transform(filename: string) {
  console.log(chalk.yellowBright('[2/3] Transform document'));
  const print = printer();
  print.start(`unzip ${filename}.zip`);
  await unzip(filename);

  print.step('inspect files');
  const tree = dirTree(filename);
  const document: DirItem = tree.children.find((child: DirItem) => child.type === 'file');
  const images: DirItem[] =
    tree.children.find((child: DirItem) => child.type === 'directory')?.children ?? [];

  print.step('upload images to s3');
  const text = interpolate(
    await uploadToS3(images),
    await fs.readFile(document.path, 'utf-8')
  );

  print.step('extract meta data');
  const { meta, content } = extractMeta(text);
  print.done();

  return {
    meta,
    content,
    exported: path.join(process.cwd(), filename),
  };
}
