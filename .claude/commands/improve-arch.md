---
name: improve-arch
description: Analyse architecture for separation of concerns, single responsibility, and code reuse opportunities
---

Analyse the architecture of this NestJS project for separation of concerns, single responsibility, and reuse opportunities. $ARGUMENTS

Steps:
1. Read all module files (`*.module.ts`) to map the dependency graph between modules.
2. Read all controllers (`*.controller.ts`) — check whether they contain:
   - Business logic that belongs in a service
   - Direct database access that bypasses the service layer
   - Response shaping that should be handled by a serialiser or interceptor
3. Read all services (`*.service.ts`) — check whether any service:
   - Does more than one unrelated thing (violates Single Responsibility)
   - Is directly coupled to infrastructure it shouldn't know about
   - Contains logic duplicated in another service
4. Review DTOs (`*.dto.ts`) — are validation constraints consistent? Could any DTOs be composed or extended rather than duplicated?
5. Review models (`*.models.ts`) vs the Prisma schema — are there discrepancies or missing fields?
6. Look for any missing abstractions: logic inlined where an interface or strategy pattern would make it easier to test or swap implementations.

For each finding, explain the concrete maintenance or testability impact — not just "this violates SRP" but "this means you can't test X without also setting up Y."

If the user asked to refactor (e.g. "refactor" or "fix" is in the arguments), apply the changes directly.
