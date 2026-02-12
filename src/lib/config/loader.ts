import fs from 'fs';
import yaml from 'yaml';
import {findConfigFiles} from './discovery.js';
import type {Config, RawConfig, ConfigMetaBlock} from './types.js';
import {DEFAULT_CONFIG} from './types.js';

export function loadConfig(
  cwd: string = process.cwd(),
  stopAt?: string
): Config {
  const files = findConfigFiles(cwd, stopAt);
  const $meta: ConfigMetaBlock = {
    mergeTips: {value: DEFAULT_CONFIG.mergeTips!, origin: 'default'},
    $files: [],
  };

  let merged: RawConfig = {...DEFAULT_CONFIG};

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const parsed: RawConfig = yaml.parse(content) || {};

      if (parsed.mergeTips !== undefined) {
        merged.mergeTips = parsed.mergeTips;
        $meta.mergeTips = {value: parsed.mergeTips, origin: file};
      }

      $meta.$files.push(file);
    } catch {
      // Skip invalid files
    }
  }

  return {
    mergeTips: merged.mergeTips!,
    $meta,
  };
}
