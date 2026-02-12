# Config System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Load config from `.tipsrc.yaml` files with directory walking and origin tracking.

**Architecture:** Config loader walks from `~/` through ancestors to `./`, merging YAML files. Each value tracks its origin via `$meta`. The `tips config` command outputs syntax-highlighted YAML.

**Tech Stack:** TypeScript, yaml package, chalk for highlighting

---

## Task 1: Config Types

**Files:**

- Create: `src/lib/config/types.ts`
- Test: `src/lib/config/types.spec.ts`

**Step 1: Write the test for config types**

```typescript
import {describe, it, expect} from '@jest/globals';
import type {Config, ConfigMeta} from './types.js';

describe('Config types', () => {
  it('allows creating a valid config object', () => {
    const config: Config = {
      mergeTips: true,
      $meta: {
        mergeTips: {value: true, origin: '~/.tipsrc.yaml'},
        $files: ['~/.tipsrc.yaml'],
      },
    };
    expect(config.mergeTips).toBe(true);
    expect(config.$meta.mergeTips.origin).toBe('~/.tipsrc.yaml');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern=types.spec.ts`
Expected: FAIL - cannot find module './types.js'

**Step 3: Write the types**

```typescript
export interface ConfigMeta {
  value: boolean;
  origin: string;
}

export interface ConfigMetaBlock {
  mergeTips: ConfigMeta;
  $files: string[];
}

export interface Config {
  mergeTips: boolean;
  $meta: ConfigMetaBlock;
}

export interface RawConfig {
  mergeTips?: boolean;
}

export const DEFAULT_CONFIG: RawConfig = {
  mergeTips: true,
};
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern=types.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/config/
git commit -m "feat(config): add config type definitions"
```

---

## Task 2: Config File Discovery

**Files:**

- Create: `src/lib/config/discovery.ts`
- Test: `src/lib/config/discovery.spec.ts`

**Step 1: Write the test for finding config files**

```typescript
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
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern=discovery.spec.ts`
Expected: FAIL - cannot find module './discovery.js'

**Step 3: Write the discovery function**

```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern=discovery.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/config/discovery.ts src/lib/config/discovery.spec.ts
git commit -m "feat(config): add config file discovery with directory walking"
```

---

## Task 3: Config Loader

**Files:**

- Create: `src/lib/config/loader.ts`
- Test: `src/lib/config/loader.spec.ts`

**Step 1: Write the test for loading and merging config**

```typescript
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
    expect(config.$meta.mergeTips.origin).toBe(configPath);
    expect(config.$meta.$files).toContain(configPath);
  });

  it('merges configs with later files winning', () => {
    fs.writeFileSync(path.join(testDir, '.tipsrc.yaml'), 'mergeTips: false');
    fs.writeFileSync(path.join(subDir, '.tipsrc.yaml'), 'mergeTips: true');

    const config = loadConfig(subDir, testDir);

    expect(config.mergeTips).toBe(true);
    expect(config.$meta.mergeTips.origin).toBe(
      path.join(subDir, '.tipsrc.yaml')
    );
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern=loader.spec.ts`
Expected: FAIL - cannot find module './loader.js'

**Step 3: Write the loader**

```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern=loader.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/config/loader.ts src/lib/config/loader.spec.ts
git commit -m "feat(config): add config loader with merging and origin tracking"
```

---

## Task 4: Config Index Export

**Files:**

- Create: `src/lib/config/index.ts`

**Step 1: Create barrel export**

```typescript
export * from './types.js';
export * from './discovery.js';
export * from './loader.js';
```

**Step 2: Commit**

```bash
git add src/lib/config/index.ts
git commit -m "feat(config): add barrel export for config module"
```

---

## Task 5: Config Command Output

**Files:**

- Modify: `src/commands/config/index.ts`
- Test: `src/commands/config/index.spec.ts`

**Step 1: Update the test**

```typescript
import {describe, it, expect, beforeEach, afterEach} from '@jest/globals';
import {Command} from 'commander';
import {createConfigCommand} from './index.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

describe('config command', () => {
  it('creates command with correct name and description', () => {
    const command = createConfigCommand();
    expect(command).toBeInstanceOf(Command);
    expect(command.name()).toBe('config');
  });
});
```

**Step 2: Run test to verify it passes**

Run: `npm test -- --testPathPattern=commands/config`
Expected: PASS (existing test)

**Step 3: Update config command implementation**

```typescript
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
```

**Step 4: Run tests and build**

Run: `npm run build && npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/commands/config/index.ts
git commit -m "feat(config): implement tips config command with YAML output"
```

---

## Task 6: Manual Testing

**Step 1: Create test config files**

```bash
echo "mergeTips: true" > ~/.tipsrc.yaml
echo "mergeTips: false" > .tipsrc.yaml
```

**Step 2: Test the command**

Run: `npm run build && node dist/index.js config`

Expected output:

```yaml
# tips config
# Loaded: ~/.tipsrc.yaml, ./.tipsrc.yaml

# origin: ./.tipsrc.yaml
mergeTips: false
```

**Step 3: Test pipe output (no colors)**

Run: `node dist/index.js config | cat`

Expected: Same output without color codes

**Step 4: Clean up test files**

```bash
rm ~/.tipsrc.yaml .tipsrc.yaml
```

**Step 5: Commit any fixes**

If fixes were needed, commit them.

---

## Task 7: Update README

**Files:**

- Modify: `README.md`

**Step 1: Add config documentation**

````markdown
# tips

CLI tool for saving and recalling useful tricks and shortcuts.

## Quickstart

Install and run:

```bash
npm install -g tips
tips
```
````

## Configuration

Tips uses `.tipsrc.yaml` for configuration. Files are loaded in order (later wins):

1. `~/.tipsrc.yaml` - User defaults
2. Ancestor directories walking toward current directory
3. `./.tipsrc.yaml` - Project-specific

### Example `.tipsrc.yaml`

```yaml
mergeTips: true # Combine user + project tips (default: true)
```

### View resolved config

```bash
tips config
```

Outputs valid YAML showing current config and where each value originated.

````

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add configuration documentation to README"
````

---

## Task 8: Final Verification

**Step 1: Run full test suite**

Run: `npm test`
Expected: All tests pass

**Step 2: Run linter**

Run: `npm run lint`
Expected: No errors

**Step 3: Build**

Run: `npm run build`
Expected: Compiles successfully

**Step 4: Final commit if needed**

```bash
git status
# If any uncommitted changes, commit them
```
