import * as execa from 'execa';

const getCookieScript = `
tell application "Google Chrome"
    execute front window's active tab javascript "document.cookie;"
end tell
`;

const getUrlScript = `
tell application "Google Chrome"
    set frontIndex to active tab index of front window
    get URL of tab frontIndex of front window
end tell
`;

async function runAppleScript(script: string): Promise<string> {
  const { stderr, stdout, exitCode } = await execa('osascript', ['-ss', '-'], {
    input: script,
  });

  if (stdout === 'missing value') return '';
  if (exitCode === 0) return stdout.slice(1, -1);

  throw new Error(stderr);
}

/**
 * Retreive a url active tab of Google Chrome
 * and asert it would be notion page
 */
export async function getTargetUrl(): Promise<string> {
  const targetUrl = await runAppleScript(getUrlScript);
  if (!targetUrl.includes('notion.so')) {
    throw new Error('Expect notion page be active tab of Google Chrome');
  }
  return targetUrl;
}

/**
 * Retreive cookie string from active tab of Google Chrome
 */
export async function getCookies(): Promise<string> {
  const cookie = await runAppleScript(getCookieScript);
  if (cookie === '') {
    throw new Error('Missing notion cookies');
  }
  return cookie;
}
