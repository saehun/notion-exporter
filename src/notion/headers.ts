import { ExportContext } from './types';
import { cfduid, tokenV2 } from '../env';

// Http Only Cookies;
const httpOnlyCookies = (): string => {
  if (tokenV2 && cfduid) {
    return `; token_v2=${tokenV2}; __cfduid=${cfduid}`;
  }

  throw new Error(`Notion http only token required
set environment variable:
  NOTION_TOKEN_V2=<value>
  NOTION_TOKEN_CFDUID=<value>
`);
};

/**
 * Create notion header object
 */
export function notionHeaders(arg: ExportContext): Record<string, string> {
  return {
    Authority: 'www.notion.so',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'X-Notion-Active-User-Header': arg.notionId,
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    'Notion-Client-Version': '23.7.39',
    Accept: '*/*',
    Origin: 'https://www.notion.so',
    Referer: arg.targetUrl,
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    Cookie: arg.cookies + httpOnlyCookies(),
    'Accept-Encoding': 'gzip',
  };
}
