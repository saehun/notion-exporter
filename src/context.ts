import { ExportContext } from './types';

/**
 * Document id parser
 */
function documentIdFromUrl(url: string): string {
  const parsed = /(\w{32})$/.exec(url);
  if (parsed == null) {
    throw new Error("Can't find document id from url:\n  " + url);
  }
  return parsed[1];
}

/**
 * Notion id parser
 */
function notionIdFromCookie(cookie: string): string {
  const parsed = /notion_user_id=([\w-]+?);/.exec(cookie);
  if (parsed == null) {
    throw new Error("Can't find notion user id. make sure signed");
  }
  return parsed[1];
}

/**
 * Create context from url and cookies
 */
export function createContext(targetUrl: string, cookies: string): ExportContext {
  const notionId = notionIdFromCookie(cookies);
  const documentId = documentIdFromUrl(targetUrl);

  const context: ExportContext = {
    cookies,
    notionId,
    targetUrl,
    documentId,
  };

  return context;
}
