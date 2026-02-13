import {describe, it, expect, beforeEach, afterEach} from '@jest/globals';
import {loadConfig} from './loader.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

describe('loadConfig', () => {
  const testDir = path.join(os.tmpdir(), 'tips-loader-test-' + Date.now());
  const subDir = path.join(testDir, 'project');

  beforeEach(() => {
    fs.mkdirSync(subDir, {recursive: true});
  });

  afterEach(() => {
    fs.rmSync(testDir, {recursive: true, force: true});
  });

  it('returns default config when no files exist', () => {
    const config = loadConfig(subDir, testDir);
    expect(config.mergeTips).toBe(true);
    expect(config.$meta.$files).toEqual([]);
  });

  it('loads config from single file', () => {
    const configPath = path.join(subDir, '.tipsrc.yaml');
    fs.writeFileSync(configPath, 'mergeTips: false');

    const config = loadConfig(subDir, testDir);

    expect(config.mergeTips).toBe(false);
    expect(config.$meta.mergeTips.source).toBe(configPath);
    expect(config.$meta.$files).toContain(configPath);
  });

  it('merges configs with later files winning', () => {
    const parentConfig = path.join(testDir, '.tipsrc.yaml');
    const childConfig = path.join(subDir, '.tipsrc.yaml');
    fs.writeFileSync(parentConfig, 'mergeTips: false');
    fs.writeFileSync(childConfig, 'mergeTips: true');

    const config = loadConfig(subDir, testDir);

    expect(config.mergeTips).toBe(true);
    expect(config.$meta.mergeTips.source).toBe(childConfig);
  });
});
