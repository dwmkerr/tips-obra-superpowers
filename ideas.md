# Ideas

Future enhancements to consider.

## XDG Support

Support XDG Base Directory Specification as an alternative to RC files:

- `~/.config/tips/config.yaml` instead of `~/.tipsrc.yaml`
- Detect which convention is in use, or allow both

## Tips Directory (~/.tips.d)

Support splitting tips across multiple files:

- `~/.tips.d/*.md` - all markdown files loaded as tips
- Allows organizing tips by topic (git.md, vim.md, etc.)
- Project equivalent: `./.tips.d/`
