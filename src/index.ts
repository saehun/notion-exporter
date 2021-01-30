import { downloadNotionMarkdown } from './notion';

async function main() {
  const zipFile = await downloadNotionMarkdown();
  console.log(zipFile);
}

main();
