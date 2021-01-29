// Export task request payload
export type ExportTask = {
  request: {
    blockId: string;
    recursive: boolean;
    exportOptions: {
      locale: string;
      timeZone: string;
      exportType: string;
    };
  };
  eventName: 'exportBlock';
};

// helper
export type ListResult<T> = {
  results: T[];
};

// Response payload interfaces
export type NotionTaskResult<R, S> = {
  id: string;
  eventName: string;
  request: R;
  actor: {
    table: string;
    id: string;
  };
  state: string;
  status: S;
};

export type ExportResult = {
  type: string;
  pagesExported: number;
  exportURL: string;
};

export type ExportTaskResult = NotionTaskResult<ExportTask, ExportResult>;

export type ExportContext = {
  cookies: string;
  notionId: string;
  targetUrl: string;
  documentId: string;
};
