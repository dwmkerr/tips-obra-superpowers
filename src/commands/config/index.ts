import {Command} from 'commander';
import chalk from 'chalk';
import {loadConfig} from '../../lib/config/index.js';

export function createConfigCommand(): Command {
  const configCommand = new Command('config');

  configCommand.description('Show resolved configuration').action(() => {
    const config = loadConfig();
    const isTTY = process.stdout.isTTY;

    const lines: string[] = [];
    lines.push('# Config loaded from');
    if (config.$meta.$files.length === 0) {
      lines.push('# - defaults');
    } else {
      for (const file of config.$meta.$files) {
        lines.push(`# - ${file}`);
      }
    }
    lines.push('');

    lines.push(`# Source: ${config.$meta.mergeTips.source}`);
    lines.push(`mergeTips: ${config.mergeTips}`);

    const output = lines.join('\n');

    if (isTTY) {
      // Syntax highlight for TTY
      const highlighted = output
        .split('\n')
        .map((line) => {
          if (line.startsWith('#')) return chalk.dim(line);
          if (line.includes(':')) {
            const [key, val] = line.split(': ');
            return chalk.cyan(key) + ': ' + chalk.yellow(val);
          }
          return line;
        })
        .join('\n');
      console.log(highlighted);
    } else {
      console.log(output);
    }
  });

  return configCommand;
}
