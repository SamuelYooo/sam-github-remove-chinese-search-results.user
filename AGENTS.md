# Repository Guidelines

## Project Structure & Module Organization

This repository currently contains a single Tampermonkey userscript:
`sam-github-remove-chinese-search-results.user.git.js`. Treat it as the source
of truth for the browser script, including the `// ==UserScript==` metadata
block, blacklist constants, DOM observer, and `Check()` filtering routine. The
`.omx/` directory is local agent/runtime state and should not be treated as
application source.

If the script grows, split reusable logic into `src/` and place tests under
`tests/`; keep the userscript entry file small and focused on metadata,
initialization, and browser integration.

## Build, Test, and Development Commands

There is no package manager or build pipeline configured yet.

- `rg --files` lists tracked project files quickly.
- `Get-Content ".\sam-github-remove-chinese-search-results.user.git.js"`
  inspects the current script.
- Manual development flow: edit the userscript, import or paste it into
  Tampermonkey, then reload `https://github.com/search?...` to verify behavior.

Do not add npm, Rust, or bundler tooling unless the script is being reorganized
into a larger project.

## Coding Style & Naming Conventions

Keep JavaScript plain and browser-compatible. Use 4-space indentation, `const`
or `let` instead of `var` for new code, semicolons for statements, and
descriptive camelCase names such as `blackListedUsers` or `titleList`. Keep
userscript metadata fields accurate, especially `@name`, `@match`,
`@downloadURL`, and `@updateURL`.

Prefer small pure helper functions for filtering rules. Avoid hard-coding new
DOM selectors in multiple places; define them near the search routine and add a
short comment when GitHub-specific markup is involved.

## Testing Guidelines

No automated tests exist. For each change, manually verify at least one GitHub
search page where blocked users, exact project names, and keyword-based project
names should be removed. Confirm that non-blocked results remain visible and
that the console log only reports intended removals.

If tests are added later, name them after behavior, for example
`filters-blocklisted-users.test.js`.

## Commit & Pull Request Guidelines

This directory is not currently a Git repository, so no local commit history is
available. When Git is initialized, use concise imperative commit subjects, for
example `fix: update GitHub search selector` or `docs: add contributor guide`.

Pull requests should describe the user-visible filtering change, list manual
GitHub search cases tested, and include screenshots only when DOM or display
behavior changes.

## Security & Configuration Tips

Keep the `@match` scope limited to GitHub search pages. Do not introduce remote
configuration, network requests, or dynamic code execution without documenting
the privacy impact and failure behavior.
