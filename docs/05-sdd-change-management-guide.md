# 05 - Spec-Driven Development (SDD) Change Management Guide

This guide establishes the mandatory workflow for proposing, designing, implementing, and verifying changes to the **Pokémon Stadium Team Randomizer** using **Spec-Driven Development (SDD)**.

---

## 1. The SDD Lifecycle

In this repository, **the specification is the single source of truth**. Code is an implementation detail derived from the spec.

```
┌────────────────────────────────────────────────────────┐
│ 1. SPECIFICATION (Define / Update Docs)                │
│ Update domain models, schemas, or functional flows     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. SCHEMA & CONTRACT VALIDATION                        │
│ Ensure backwards compatibility and data integrity      │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. CODE IMPLEMENTATION                                 │
│ Implement components, state transitions, or utils      │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. VERIFICATION & TEST VALIDATION                      │
│ Verify adherence to invariants and functional contracts│
└────────────────────────────────────────────────────────┘
```

---

## 2. Step-by-Step Change Protocol

Whenever a new feature, bug fix, or refactor is planned:

### Step 1: Consult Existing Specs
- Check `docs/01-system-architecture.md` for state machine or component implications.
- Check `docs/02-domain-models-and-schemas.md` for data schema requirements.
- Check `docs/03-functional-specifications.md` for user flows and generation logic.
- Check `docs/04-future-extensions-roadmap.md` if the change relates to planned expansions.

### Step 2: Propose and Document Spec Updates First
- Before editing `src/`, modify the relevant document in `docs/` to reflect the desired behavior, schemas, or state changes.
- For data modifications (e.g., adding Gen 2 Pokémon), update the schema definitions in `02-domain-models-and-schemas.md` first.

### Step 3: Implement the Minimal Required Code Change
- Implement the changes in `src/` strictly conforming to the updated documentation.
- Maintain immutability and clean component decoupling.

### Step 4: Validate Invariants
Ensure the following non-negotiable invariants are preserved:
1. **Team Size**: Always strictly 6 Pokémon upon completion.
2. **Species Uniqueness**: No duplicate Pokémon IDs within a single team.
3. **Tier Determinism**: Every selected Pokémon strictly matches the tier(s) of its assigned Pokeball.
4. **State Machine Integrity**: Only valid transitions (`CHOOSE` $\to$ `OPEN` $\to$ `REVEAL` $\to$ `COMPLETED`) are permitted.

---

## 3. Checklist for Future PRs / Changes

Before marking any task complete, confirm:
- [ ] Has the corresponding documentation in `docs/` been created or updated?
- [ ] Does the change violate any existing state transitions or domain schemas?
- [ ] Are all audio assets and image URLs reachable and valid?
- [ ] Do automated tests pass cleanly (`npm test -- --watchAll=false`)?
