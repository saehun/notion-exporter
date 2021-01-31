import * as chalk from 'chalk';
import * as fs from 'fs/promises';
import * as execa from 'execa';
import { accessKeyId, bucket, cdnUrl, secretAccessKey } from '../env';
import { v4 as uuid } from 'uuid';
const dirTree = require('directory-tree');
const rimraf = require('rimraf');

import * as S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
  credentials: { accessKeyId, secretAccessKey },
  region: 'ap-northeast-2',
});

type DirItem = {
  path: string;
  name: string;
  size: number;
  extension: string;
  type: 'file' | 'directory';
};

async function uploadToS3(images: DirItem[]) {
  const uploaded = images
    .filter(image => image.extension === '.png')
    .map(async image => {
      const id = uuid();
      const file = await fs.readFile(image.path);
      await s3
        .putObject({
          Bucket: bucket,
          Body: file,
          Key: `notion/${id}.png`,
          ACL: 'public-read',
        })
        .promise();

      return {
        name: image.name,
        path: image.path.replace(/^.*?\//, ''),
        url: `${cdnUrl}/notion/${id}.png`,
      };
    });
  return Promise.all(uploaded);
}

async function unzip(filename: string): Promise<void> {
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

export async function transform(filename: string) {
  console.log(chalk.yellowBright('[2/3] Transform document'));
  // await unzip(filename);
  const tree = dirTree(filename);

  const document: DirItem = tree.children.find((child: DirItem) => child.type === 'file');
  const images: DirItem[] =
    tree.children.find((child: DirItem) => child.type === 'directory')?.children ?? [];

  let text = await fs.readFile(document.path, 'utf-8');

  // const uploadedImages = await uploadToS3(images);
  const uploadedImages = [
    {
      name: 'Untitled 1.png',
      path: 'Copy of TEMPLATE 한글 71e458d1c7e34be1be9856f81a2e1be3/Untitled 1.png',
      url: 'https://cdn.saeh.io/notion/ed42afd3-93e3-493c-b898-3f8cfb395b45.png',
    },
    {
      name: 'Untitled.png',
      path: 'Copy of TEMPLATE 한글 71e458d1c7e34be1be9856f81a2e1be3/Untitled.png',
      url: 'https://cdn.saeh.io/notion/401c36d1-1285-42f1-b8b8-f50a2d335e58.png',
    },
  ];

  for (const image of uploadedImages) {
    const original = encodeURI(image.path);
    const updated = image.url;
    console.log(original, updated);
    text = text.replace(`[${original}]`, '[attachment]');
    text = text.replace(`(${original})`, `(${updated})`);
  }

  return extractMeta(text);
}

function extractMeta(text: string): { meta: Record<string, string>; content: string } {
  const lines = text.split('\n');
  const title = lines[0].replace(/^#/, '');
  const metaStart = lines.indexOf('') + 1;
  const metaEnd = lines.indexOf('', metaStart);

  const meta = lines.slice(metaStart, metaEnd).reduce(
    (acc, line) => {
      const parsed = /^(.+?): (.*)$/.exec(line);
      if (parsed == null) {
        throw new Error(`${line} does not match meta format`);
      }
      const [, key, value] = parsed;
      return { ...acc, [key]: value };
    },
    { title }
  );

  const content = lines.slice(metaEnd + 1).join('\n');

  return {
    meta,
    content,
  };
}
