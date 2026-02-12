# tips

CLI tool for saving and recalling useful tricks and shortcuts.

## Quickstart

Install and run:

```bash
npm install -g tips
tips
```

## Configuration

Tips uses `.tipsrc.yaml` for configuration. Files are loaded in order (later wins):

1. `~/.tipsrc.yaml` - User defaults
2. Ancestor directories walking toward current directory
3. `./.tipsrc.yaml` - Project-specific

### Example `.tipsrc.yaml`

```yaml
mergeTips: true  # Combine user + project tips (default: true)
```

### View resolved config

```bash
tips config
```

Outputs valid YAML showing current config and where each value originated.
