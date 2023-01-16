// deno-lint-ignore-file no-explicit-any
import chalk from "chalk";

export function log(...data: any[]) {
  console.log(...data);
}

export function info(...data: any[]) {
  console.log(chalk.blue(...data));
}

export function error(...data: any[]) {
  console.error(chalk.red(...data));
}

export function success(...data: any[]) {
  console.log(chalk.green(...data));
}
