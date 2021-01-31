import { getCookies, getTargetUrl } from './appleScript';
import { createContext } from './context';
import { downloadZip } from './downloadZip';
import { requestDownloadLink } from './requestDonwloadLink';
import { requestEnqueueTask } from './requestEnqueueTask';
import { printer } from './printer';
import * as chalk from 'chalk';

export async function download(): Promise<string> {
  return 'exported-1612093409248';
  try {
    console.log(chalk.yellowBright('[1/3] Download from notion'));
    const print = printer();

    print.start('retreive notion url and cookies');
    const context = createContext(await getTargetUrl(), await getCookies());
    print.step('export notion document to markdown');
    const taskId = await requestEnqueueTask(context);
    print.step('waiting download link is ready');
    const link = await requestDownloadLink(context, taskId);
    print.step('download zip file');
    const filename = await downloadZip(link);
    print.done();

    return filename;
  } catch ({ isAxiosError, response, message }) {
    console.error(isAxiosError ? response?.data : message);
    process.exit(1);
  }
}
