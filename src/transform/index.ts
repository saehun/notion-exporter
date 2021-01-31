import * as chalk from 'chalk';
import * as fs from 'fs';
import * as execa from 'execa';

async function unzip(filename: string): Promise<void> {
  await execa('unzip', [filename + '.zip', '-d', filename]);
}

export async function transform(zipfile: string) {
  console.log(chalk.yellowBright('[2/3] Transform document'));
  await unzip(filename);
  const documentName = await getDocumentName(filename);
  const images = await getImages(filename, documentName);

  await uploadToS3(images);
  const content = await


  return {
    content: 'asdf',
    meta: {},
  };
}
