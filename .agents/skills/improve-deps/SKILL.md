---
name: improve-deps
description: Audit npm dependencies for outdated packages and security vulnerabilities
---

Audit this project's npm dependencies for outdated packages and security vulnerabilities. $ARGUMENTS

Steps:
1. Read `package.json` to understand what is installed.
2. Run `npm outdated --json` to get the full list of outdated packages (exits non-zero when outdated — output is still valid JSON).
3. Run `npm audit --json` to find known CVEs and security advisories.
4. Classify each outdated package:
   - **patch** (e.g. 1.0.1 → 1.0.2): safe to bump
   - **minor** (e.g. 1.0.0 → 1.1.0): usually safe, flag if the package is a framework with surface area
   - **major** (e.g. 1.x → 2.x): likely breaking changes — explain what to watch out for
5. For security findings, report the package, severity, CVE ID if available, and recommended fix version.
6. Summarise which bumps are safe to apply immediately and which need manual review.

If the user asked to apply changes (e.g. "apply" or "fix" is in the arguments), update `package.json` with the safe patch and minor bumps, then remind the user to run `npm install` afterwards.
