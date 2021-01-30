import axios from 'axios';
import { notionHeaders } from './headers';
import { ExportContext, ExportTask } from './types';

/**
 * create export task notion payload
 */
function notionTask({ documentId }: ExportContext): ExportTask {
  const blockId = [
    documentId.slice(0, 8),
    documentId.slice(8, 12),
    documentId.slice(12, 16),
    documentId.slice(16, 20),
    documentId.slice(20),
  ].join('-');

  return {
    request: {
      blockId,
      recursive: false,
      exportOptions: { locale: 'en', timeZone: 'Asia/Seoul', exportType: 'markdown' },
    },
    eventName: 'exportBlock',
  };
}

/**
 * Make export task request to notion
 */
export async function requestEnqueueTask(ctx: ExportContext): Promise<string> {
  const { data } = await axios.post(
    'https://www.notion.so/api/v3/enqueueTask',
    { task: notionTask(ctx) },
    { headers: notionHeaders(ctx) }
  );

  if (data.taskId != null) {
    return data.taskId;
  }

  throw new Error('Export failed');
}
