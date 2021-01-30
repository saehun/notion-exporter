import { requestTaskStatus } from './requestTaskStatus';
import { ExportContext, ExportTaskResult } from './types';

const MAX_REQUEST = 10;
const INTERVAL = 3000;

/**
 * Polling download link
 */
export async function requestDownloadLink(ctx: ExportContext, taskId: string): Promise<string> {
  let count = 0;
  let task: ExportTaskResult;
  do {
    task = await requestTaskStatus(ctx, taskId);
    if (task.status.type === 'complete') {
      return task.status.exportURL;
    }
    await new Promise(resolve => setTimeout(resolve, INTERVAL));
  } while (count++ < MAX_REQUEST);

  throw new Error(JSON.stringify(task, undefined, 2));
}
