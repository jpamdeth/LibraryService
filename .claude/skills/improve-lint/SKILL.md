---
name: improve-lint
description: Analyse code quality for antipatterns and code smells beyond what ESLint catches automatically
---

Analyse code quality for this TypeScript/NestJS project — look beyond what ESLint catches automatically. $ARGUMENTS

Steps:
1. Run `npx eslint src --format json 2>&1` and summarise any errors or warnings by pattern. Don't list every instance — identify the pattern and the files affected.
2. Read the source files and check for these antipatterns:
   - **Silent error swallowing**: catch blocks that log and re-throw nothing, or that return a default where the caller can't distinguish success from failure.
   - **Magic strings/numbers**: hardcoded values that appear in more than one place or that have semantic meaning (status codes, model names, limits).
   - **Single Responsibility violations**: functions or methods that do more than one thing — name them specifically.
   - **Inconsistent patterns**: e.g. some methods use the NestJS Logger, some use `console.log`, some log nothing — point out where the inconsistency lives.
   - **Deeply nested conditionals** that could be simplified with early returns or guard clauses.
   - **Overly permissive types**: use of `any` or `unknown` where a proper type is derivable.
3. For each finding, cite the file and line number, explain the risk or maintenance cost, and show the improved version.

If the user asked to fix issues (e.g. "fix" or "apply" is in the arguments), apply the straightforward fixes directly using edit_file.
