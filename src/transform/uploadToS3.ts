import * as fs from 'fs/promises';
import * as S3 from 'aws-sdk/clients/s3';
import { v4 as uuid } from 'uuid';
import { accessKeyId, bucket, cdnUrl, secretAccessKey } from '../env';
import { DirItem } from './types';
const dirTree = require('directory-tree');
const rimraf = require('rimraf');

const s3 = new S3({
  credentials: { accessKeyId, secretAccessKey },
  region: 'ap-northeast-2',
});

export async function uploadToS3(images: DirItem[]) {
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
          ContentType: 'image/png',
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
