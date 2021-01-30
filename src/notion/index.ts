import { getCookies, getTargetUrl } from './appleScript';
import { createContext } from './context';
import { downloadZip } from './downloadZip';
import { requestDownloadLink } from './requestDonwloadLink';
import { requestEnqueueTask } from './requestEnqueueTask';
import { printer } from './printer';
import * as chalk from 'chalk';

export async function downloadNotionMarkdown(): Promise<string> {
  try {
    console.log(chalk.yellowBright('[1/3] Notion'));
    const print = printer();

    print.start('retreive notion url and cookies');
    const context = createContext(await getTargetUrl(), await getCookies());
    print.step('export notion document to markdown');
    const taskId = await requestEnqueueTask(context);
    print.step('waiting download link is ready');
    const link = await requestDownloadLink(context, taskId);
    print.step('download zip file');
    const zipfile = await downloadZip(link);
    print.done();

    return zipfile;
  } catch ({ isAxiosError, response, message }) {
    console.error(isAxiosError ? response?.data : message);
    process.exit(1);
  }
}
