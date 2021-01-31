import axios from 'axios';
import * as fs from 'fs';

/**
 * Download and save a exported zip file to local file system
 */
export async function downloadZip(url: string): Promise<string> {
  const filename = `exported-${Date.now()}`;
  const { data } = await axios.get(url, { responseType: 'stream' });
  const writeStream = fs.createWriteStream(filename + '.zip');

  data.pipe(writeStream);

  return new Promise(resolve => {
    writeStream.on('close', () => {
      resolve(filename);
    });
  });
}
