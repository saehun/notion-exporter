import * as chalk from 'chalk';

export async function commit({
  content,
  meta,
}: {
  content: string;
  meta: Record<string, any>;
}): Promise<any> {
  console.log(chalk.yellowBright('[3/3] Commit'));
  console.log(content, meta);
}
