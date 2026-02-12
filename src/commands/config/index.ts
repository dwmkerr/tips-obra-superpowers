import {Command} from 'commander';
import chalk from 'chalk';
import {loadConfig} from '../../lib/config/index.js';

export function createConfigCommand(): Command {
  const configCommand = new Command('config');

  configCommand.description('Show resolved configuration').action(() => {
    const config = loadConfig();
    const isTTY = process.stdout.isTTY;

    const lines: string[] = [];
    lines.push('# tips config');
    lines.push(`# Loaded: ${config.$meta.$files.join(', ') || '(defaults)'}`);
    lines.push('');

    lines.push(`# origin: ${config.$meta.mergeTips.origin}`);
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
