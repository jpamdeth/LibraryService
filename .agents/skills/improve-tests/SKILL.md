---
name: improve-tests
description: Analyse test coverage and identify untested methods, error paths, and missing spec files
---

Analyse test coverage for this NestJS project and identify meaningful gaps. $ARGUMENTS

Steps:
1. List all source files under `src/` — exclude `*.spec.ts`, `*.module.ts`, `main.ts`, and files in `dto/`.
2. List all spec files under `src/` and map each to its source counterpart.
3. Flag source files that have no spec at all.
4. Run `npx jest --coverage --coverageReporters=text-summary 2>&1` to get overall line coverage.
5. For source files that do have specs, read both files and check:
   - Are all public methods exercised by at least one test?
   - Are error paths tested — e.g. what happens when Prisma throws, or a record is not found?
   - Are mocks hiding important behaviour (e.g. mocking away the thing being tested)?
6. For each gap, explain the specific scenario that is missing and why it matters.

This project uses `@golevelup/ts-jest` `createMock<T>()` for deep mocks — no manual mock objects. Keep that convention when suggesting new tests.

If the user asked to write tests (e.g. "write" or "add" is in the arguments), generate the missing spec code directly.
