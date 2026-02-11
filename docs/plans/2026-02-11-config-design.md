# Config System Design

## Overview

Separate configuration from tips content. Config controls CLI behavior, tips files contain the actual tips.

## File Structure

**Config file:** `.tipsrc.yaml`
- Lookup order (lowest → highest priority):
  1. `~/.tipsrc.yaml` — user defaults
  2. Walk from root toward PWD
  3. `./.tipsrc.yaml` — local project (wins)

**Tips file:** `.tips.md`
- Lookup: `~/.tips.md` → `./.tips.md`
- Merge strategy: combine all tips (unless `mergeTips: false`)

## Config Schema

Initial minimal schema:

```yaml
mergeTips: true  # Combine user + project tips (default: true)
```

## Config Object Structure

```typescript
interface ConfigMeta {
  value: boolean;
  origin: string;  // e.g. "~/.tipsrc.yaml"
}

interface Config {
  mergeTips: boolean;
  $meta: {
    mergeTips: ConfigMeta;
    $files: string[];  // all files that were loaded
  };
}
```

Example resolved config:

```typescript
{
  mergeTips: false,
  $meta: {
    mergeTips: { value: false, origin: "./.tipsrc.yaml" },
    $files: ["~/.tipsrc.yaml", "./.tipsrc.yaml"]
  }
}
```

## `tips config` Command

Outputs valid YAML with origin comments:

```yaml
# tips config
# Loaded: ~/.tipsrc.yaml, ./.tipsrc.yaml

# origin: ./.tipsrc.yaml
mergeTips: false
```

**Behavior:**
- TTY: Syntax-highlighted YAML (chalk)
- Pipe: Plain YAML (no color codes)
- Always valid YAML that can be piped to a file

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Config format | Separate `.tipsrc.yaml` | Separation of concerns; original YAML frontmatter conflates config and content |
| Naming | RC style not XDG | Simpler; XDG can be added later (see ideas.md) |
| Initial schema | `mergeTips` only | YAGNI - add settings as features need them |
| Priority order | Local wins over user | Idiomatic - more specific overrides general |
| Metadata | `$meta` property | No proxy magic, TypeScript-friendly |

## Future Considerations

See `ideas.md`:
- XDG Base Directory support
- `~/.tips.d/` directory for multiple tip files
