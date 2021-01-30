import * as ora from 'ora';

/**
 * spinning terminal printer
 */
export function printer() {
  const spinner = ora();
  return {
    start: (text: string): any => spinner.start(text),
    step: (text: string): any => spinner.succeed().start(text),
    done: (): any => spinner.succeed(),
  };
}
