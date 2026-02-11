#!/usr/bin/env node
import {Command} from 'commander';
import chalk from 'chalk';
import {createConfigCommand} from './commands/config/index.js';

const program = new Command();

program
  .name('tips')
  .description('Save and recall useful tricks and shortcuts')
  .version('0.1.0');

program.addCommand(createConfigCommand());

// Default action: show welcome message
program.action(() => {
  console.log();
  console.log(chalk.bold('tips') + ' - save and recall useful tricks');
  console.log(chalk.dim('https://github.com/dwmkerr/tips'));
  console.log();
  console.log('Run ' + chalk.cyan('tips --help') + ' for available commands.');
  console.log();
});

program.parseAsync(process.argv);
