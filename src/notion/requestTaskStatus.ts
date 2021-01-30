import axios from 'axios';
import { notionHeaders } from './headers';
import { ExportContext, ExportTaskResult } from './types';

/**
 * Get a status of the task for given id
 */
export async function requestTaskStatus(
  ctx: ExportContext,
  taskId: string
): Promise<ExportTaskResult> {
  const { data } = await axios.post(
    'https://www.notion.so/api/v3/getTasks',
    { taskIds: [taskId] },
    { headers: notionHeaders(ctx) }
  );

  const taskStatus = data.results?.[0];
  if (taskStatus != null) {
    return taskStatus;
  }

  throw new Error('Failed to get task status');
}
