export function extractMeta(
  text: string
): { meta: Record<string, string>; content: string } {
  const lines = text.split('\n');
  const title = lines[0].replace(/^#/, '');
  const metaStart = lines.indexOf('') + 1;
  const metaEnd = lines.indexOf('', metaStart);

  const meta = lines.slice(metaStart, metaEnd).reduce(
    (acc, line) => {
      const parsed = /^(.+?): (.*)$/.exec(line);
      if (parsed == null) {
        throw new Error(`${line} does not match meta format`);
      }
      const [, key, value] = parsed;
      return { ...acc, [key]: value };
    },
    { title }
  );

  const content = lines.slice(metaEnd + 1).join('\n');

  return {
    meta,
    content,
  };
}
