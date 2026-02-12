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

  it('finds config files walking up from cwd', () => {
    fs.writeFileSync(path.join(testDir, '.tipsrc.yaml'), 'mergeTips: false');
    fs.writeFileSync(path.join(subDir, '.tipsrc.yaml'), 'mergeTips: true');

    const files = findConfigFiles(subDir, testDir);

    expect(files).toHaveLength(2);
    expect(files[0]).toContain('.tipsrc.yaml');
  });

  it('returns empty array when no config files exist', () => {
    const files = findConfigFiles(subDir, testDir);
    expect(files).toEqual([]);
  });
});
