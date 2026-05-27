# Repository Guidelines

## Project Structure & Module Organization

This repository centers on one Tampermonkey userscript:
`sam-github-remove-chinese-search-results.user.git.js`. Treat it as the source
of truth for metadata, built-in filter rules, DOM scanning, mutation handling,
and local custom-rule support. Regression coverage lives in
`tests/filter-rules.test.cjs`. The `.omx/` directory is local agent/runtime
state and should not be treated as application source.

If the script grows further, split reusable logic into `src/`; keep the
userscript entry file focused on metadata, initialization, and browser
integration.

## Build, Test, and Development Commands

There is no package manager or build pipeline configured yet.

- `rg --files` lists tracked project files quickly.
- `Get-Content ".\sam-github-remove-chinese-search-results.user.git.js"`
  inspects the current script.
- `node --test tests/filter-rules.test.cjs` runs the lightweight filter tests.
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

Automated coverage lives in `tests/filter-rules.test.cjs` and uses Node's built-
in test runner. For each filter change, add or update cases for blocked
repositories, blocked snippets, and allowed normal repositories. Also manually
verify at least one GitHub search page and confirm that the console log only
reports intended removals.

Name new tests after behavior, for example `filters-blocklisted-users.test.js`.

## Commit & Pull Request Guidelines

Use concise imperative commit subjects for routine changes, for example
`fix: update GitHub search selector` or `docs: add README`. Larger changes
should follow the repository's Lore-style trailer format when useful.

Pull requests should describe the user-visible filtering change, list manual
GitHub search cases tested, and include screenshots only when DOM or display
behavior changes.

## Security & Configuration Tips

Keep the `@match` scope limited to GitHub search pages. Do not introduce remote
configuration, network requests, or dynamic code execution without documenting
the privacy impact and failure behavior.
