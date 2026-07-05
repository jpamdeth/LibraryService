---
name: improve
description: Run a full codebase improvement analysis — dependencies, test coverage, code quality, and architecture
---

Run a full codebase improvement analysis. Work through each of the four areas below in sequence, printing a clear section header before each one. For each finding, state the file and line where relevant, explain why it matters, and suggest the fix. At the end, print a summary table of all findings grouped by severity.

---

## 1. Dependencies

- Read `package.json`.
- Run `npm outdated --json` (exits non-zero when packages are outdated — the output is still valid JSON).
- Run `npm audit --json` to find CVEs.
- Classify each outdated package as patch / minor / major and each vulnerability by its reported severity.
- List what can be safely bumped and what needs manual review.

## 2. Test Coverage

- List all source files under `src/` (excluding `*.spec.ts`, `*.module.ts`, `main.ts`, and dto files).
- List all spec files and map them to their source counterparts.
- Run `npx jest --coverage --coverageReporters=text-summary 2>&1` to get line coverage numbers.
- For source files with specs, read both and check: are all public methods tested? Are error paths and not-found cases covered?
- Flag every meaningful gap with the specific method or branch that is untested.

## 3. Code Quality

- Run `npx eslint src --format json 2>&1` and summarise any errors or warnings by pattern (don't list every instance).
- Read the source files and look for:
  - Overly broad catch blocks that swallow errors silently
  - Magic strings or numbers that should be constants
  - Functions doing more than one thing
  - Inconsistent patterns across similar files
  - Deeply nested conditionals that could use early returns

## 4. Architecture

- Read all module files (`*.module.ts`) to understand the dependency graph.
- Read all controllers — check for business logic that belongs in a service.
- Read all services — check for Single Responsibility violations and unnecessary coupling to infrastructure.
- Look for duplicated logic that could be extracted into a shared utility.
- Review DTOs for missing validation or inconsistency with the Prisma schema.
