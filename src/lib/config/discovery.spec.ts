import {describe, it, expect, beforeEach, afterEach} from '@jest/globals';
import {findConfigFiles} from './discovery.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

describe('findConfigFiles', () => {
  const testDir = path.join(os.tmpdir(), 'tips-test-' + Date.now());
  const subDir = path.join(testDir, 'project');

  beforeEach(() => {
    fs.mkdirSync(subDir, {recursive: true});
  });

  afterEach(() => {
    fs.rmSync(testDir, {recursive: true, force: true});
  });

  it('finds config files walking up from cwd in correct order', () => {
    const parentConfig = path.join(testDir, '.tipsrc.yaml');
    const childConfig = path.join(subDir, '.tipsrc.yaml');
    fs.writeFileSync(parentConfig, 'mergeTips: false');
    fs.writeFileSync(childConfig, 'mergeTips: true');

    const files = findConfigFiles(subDir, testDir);

    expect(files).toHaveLength(2);
    expect(files[0]).toBe(parentConfig);
    expect(files[1]).toBe(childConfig);
  });

  it('handles cwd equals stopAt', () => {
    fs.writeFileSync(path.join(testDir, '.tipsrc.yaml'), 'mergeTips: true');

    const files = findConfigFiles(testDir, testDir);

    expect(files).toHaveLength(1);
  });

  it('returns empty array when no config files exist', () => {
    const files = findConfigFiles(subDir, testDir);
    expect(files).toEqual([]);
  });
});
