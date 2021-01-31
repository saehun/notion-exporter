import * as chalk from 'chalk';
import * as fs from 'fs/promises';
import * as execa from 'execa';
import { accessKeyId, bucket, cdnUrl, secretAccessKey } from '../env';
import { v4 as uuid } from 'uuid';
const dirTree = require('directory-tree');

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
        path: image.path,
        url: `${cdnUrl}/notion/${id}.png`,
      };
    });
  return Promise.all(uploaded);
}

async function unzip(filename: string): Promise<void> {
  await execa('unzip', [filename + '.zip', '-d', filename]);
}

export async function transform(filename: string) {
  console.log(chalk.yellowBright('[2/3] Transform document'));
  // await unzip(filename);
  const tree = dirTree(filename);

  const document: DirItem = tree.children.find((child: DirItem) => child.type === 'file');
  const images: DirItem[] =
    tree.children.find((child: DirItem) => child.type === 'directory')?.children ?? [];

  const text = await fs.readFile(document.path, 'utf-8');

  const uploadedImages = await uploadToS3(images);
  console.log(uploadedImages);

  // for (const image of uploadedImages) {
  //   text.replace();
  // }
  // console.log(text)

  /*
  const documentName = await getDocumentName(filename);
  const images = await getImages(filename, documentName);

  await uploadToS3(images);
  const content = await
  */

  return {
    content: 'asdf',
    meta: {},
  };
}
