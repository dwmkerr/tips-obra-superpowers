# Tips

`tips` is a CLI tool that helps you in the crazy world of too much learning in AI, programming and more. Whenever you find a useful trick, save it as a tip - either user or project level. Open tips at any time, test yourself, connect with Claude code to save a tip when you need or to ask for tip questions.

Tips are all in a simple markdown file - rich content, simple config and easy to share and version control.

## Tasks

### Setup

Use `mckinsey/agents-at-scale-ark` and the ./tools/ark-cli folder for style. We're going to use commander, a well documented yaml file for config, our project / build pipeline / cicd structure - see my "Build Pipelines" or "Project Setup" skills - you must fail if you can't find them.

We need to only support running the CLI with a welcome message, package.json, and basic project structure (lint, unit test, live reload, commander).

Setup the structure. If you think there are useful project level Skills, use the "Skill development" skill to add them to the project.

### Config

Use ark for inspiration. I want a well-documented config / tips file: ~/.tips.md or ./.tips.md read in sensible order. Tips contains yaml frontmatter for config of the tips CLI (user or project). It contains the tips content.

Scaffold the loading, readme, and `tips config` command. Create a follow on task which is 'tips config directory' suggesting we use a posix style ~/.tips.d or similar if we want to split into many tip files.

### Evidence in PRs

Update our PRs so that we use the shellwright MCP server when we build a pull request to record the `tips` CLI in action BEFORE the changes and AFTER the changes. Attach the recordings to the pull request. You will need to use a special skill to learn how to attach recordings - if you can't find it, stop and we will discuss.

### Interactive PRs

Show me a design for how a PR could have an interactive test. It might be a terminal mockup in a webpage in GH pages that allows us to browser only run the CLI in a browser based mock shell. Suggest ideas in the pull request.

### Basic Commands

A tip output will look something like this:

```markdown
<project name if present> **tips**
github.com/dwmkerr/tips

_Zoom In/Out in Tmux_

`<Leader>Z` to toggle zoom in / out

n - next tip, e - edit, d - delete, s - show demo, q / <enter> quit
```

In interactive shells we can ask foe input - but not if not TTY. Consider how we confi this. Suggested commands:

```
# Daily use
tip                     # one random tip
tips                    # all tips or menu?
tips git:*                # all in 'Git' section
tips #cli             # all with #cli tag (quote the #)

# Managing
tips add "git: command here #cli"    # add to section

# Setup
tips edit               # open ~/.tips.md in $EDITOR
```

IMPORTANT: Loop this task - item by item.

### MCP

Tips should also be a `stdio` mcp server, our readme should have MCP docs on how to install. It leverages the same `./lib` code to let agents show tips, add tips, understand how tips work.

### Brew / Builds

Easier way for users to install.

### Tips Marketplace

Leverage anthropic marketplace / plugin json spec and patterns to add tips from a marketplace, repo, etc. Essentially would leverage git to clone additional tip files. Need CLI commands too.

### Vim extension to show tips

I want `<Leader>ti` to show a tip, or a way to show a tip on startup rather than splash.
