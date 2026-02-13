import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_FILENAME = '.tipsrc.yaml';

export function findConfigFiles(
  cwd: string = process.cwd(),
  stopAt: string = path.parse(cwd).root
): string[] {
  const files: string[] = [];

  // Check home directory first
  const homeConfig = path.join(os.homedir(), CONFIG_FILENAME);
  if (fs.existsSync(homeConfig)) {
    files.push(homeConfig);
  }

  // Walk from stopAt down to cwd (collecting ancestors)
  const ancestors: string[] = [];
  let current = cwd;
  while (current !== stopAt && current !== path.parse(current).root) {
    ancestors.unshift(current);
    current = path.dirname(current);
  }
  if (current === stopAt) {
    ancestors.unshift(stopAt);
  }

  // Check each ancestor for config file
  for (const dir of ancestors) {
    const configPath = path.join(dir, CONFIG_FILENAME);
    if (fs.existsSync(configPath) && configPath !== homeConfig) {
      files.push(configPath);
    }
  }

  return files;
}
