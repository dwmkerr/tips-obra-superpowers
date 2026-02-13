import {describe, it, expect} from '@jest/globals';
import {Command} from 'commander';
import {createConfigCommand} from './index.js';

describe('config command', () => {
  it('creates command with correct name and description', () => {
    const command = createConfigCommand();
    expect(command).toBeInstanceOf(Command);
    expect(command.name()).toBe('config');
    expect(command.description()).toBe('Show resolved configuration');
  });
});
