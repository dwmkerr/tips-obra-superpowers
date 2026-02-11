import {Command} from 'commander';

export function createConfigCommand(): Command {
  const configCommand = new Command('config');

  configCommand.description('Manage tips configuration').action(() => {
    console.log('Config command - not yet implemented');
  });

  return configCommand;
}
