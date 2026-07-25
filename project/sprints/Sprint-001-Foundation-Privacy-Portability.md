---
title: Sprint 001 Foundation Privacy Portability
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# Sprint 001: Foundation, Privacy and AI Portability

## Sprint ID

Sprint 001.

## Name

Project Foundation, Privacy and AI Portability.

## Status

Implemented, pending owner review.

## Background

The web MVP is already usable. This sprint protects long-term value by separating project assets from private data and by making AI context portable.

## Goal

Create governance, privacy, schema, prompt and migration foundations without adding product features or changing runtime data structures.

## Scope

Documentation, draft schemas, `.gitignore`, package scripts, privacy audit, AI handoff export script and foundation validation script.

## Non-Scope

No website business features, no visual redesign, no data migration, no real AI API, no repository visibility change, no license decision and no new npm dependency.

## Inputs

The Sprint 001 request pasted into Codex on 2026-07-25 and current repository state at commit `787382b2cb520d2a0a976a4230185de48afbcab0`.

## Files

See the final modified file list in this document after implementation.

## Steps

1. Check baseline branch, commit and tests.
2. Add governance and source-of-truth documents.
3. Add architecture, privacy and security documents.
4. Add draft schemas and prompt/migration structure.
5. Add AI handoff export and validation scripts.
6. Update README, package scripts and `.gitignore`.
7. Run tests, build, validation and export.

## Acceptance Criteria

Existing website behavior remains unchanged, JSON files are valid, export files are generated, private-data directories are ignored, and no high-confidence secrets are introduced.

## Privacy Impact

Positive. The sprint adds classification, boundaries, ignore rules, audit notes and a provider-neutral AI sharing model.

## Data Migration Impact

None. Existing localStorage, IndexedDB and Supabase record structures are not changed.

## Test Results

- Baseline before implementation: `vitest run` passed, 16 files and 61 tests.
- Sprint verification: `vitest run` passed, 17 files and 63 tests.
- Added `src/__tests__/foundationScripts.test.js` with red-green verification for foundation scripts and AI handoff export.

## Build Results

Baseline and sprint verification builds passed with the existing Vite chunk-size warning. The warning is not introduced by this sprint.

## Decisions

Initial ADRs added for one repository, private data separation, replaceable AI providers and repository visibility/licensing.

## Open Issues

- Repository visibility and licensing remain founder decisions.
- Brand name remains unconfirmed.
- The current execution environment has no `npm` executable and bundled `pnpm run` is blocked by a symlink permission issue. The underlying package scripts were verified directly with `node scripts/validate-foundation.mjs` and `node scripts/build-ai-handoff.mjs`.

## Modified Files

### Added

- `PROJECT.md`
- `agents/README.md`
- `api/README.md`
- `architecture/AIProviderPortability.md`
- `architecture/BackupAndRecovery.md`
- `architecture/DataFlow.md`
- `architecture/DataOwnershipAndBoundaries.md`
- `architecture/README.md`
- `architecture/SystemArchitecture.md`
- `brand/00_BrandDNA.md`
- `brand/README.md`
- `knowledge/README.md`
- `migration/AI_HANDOFF.md`
- `migration/EXCLUDED_DATA.md`
- `migration/MIGRATION_CHECKLIST.md`
- `migration/NEW_AI_BOOTSTRAP_PROMPT.md`
- `migration/PRIVATE_CONTEXT_TEMPLATE.md`
- `migration/README.md`
- `migration/RESTORE_TEST.md`
- `migration/manifest.json`
- `product/README.md`
- `project/Backlog.md`
- `project/CurrentStatus.md`
- `project/DecisionCaptureWorkflow.md`
- `project/DefinitionOfDone.md`
- `project/FileManagementRules.md`
- `project/INDEX.md`
- `project/README.md`
- `project/Roadmap.md`
- `project/SourceOfTruth.md`
- `project/VersioningPolicy.md`
- `project/archive/README.md`
- `project/decisions/ADR-0001-Single-Repository.md`
- `project/decisions/ADR-0002-Private-Data-Separation.md`
- `project/decisions/ADR-0003-Replaceable-AI-Providers.md`
- `project/decisions/ADR-0004-Repository-Visibility-And-Licensing.md`
- `project/decisions/README.md`
- `project/sprints/Sprint-001-Foundation-Privacy-Portability.md`
- `project/templates/ADR-TEMPLATE.md`
- `project/templates/Confirmed-Decision-Prompt.md`
- `project/templates/Sprint-TEMPLATE.md`
- `prompts/README.md`
- `prompts/core/README.md`
- `prompts/platforms/chatgpt/README.md`
- `prompts/platforms/claude/README.md`
- `prompts/platforms/gemini/README.md`
- `prompts/platforms/local/README.md`
- `schemas/README.md`
- `schemas/ai-analysis-result.schema.json`
- `schemas/analysis-packet.schema.json`
- `schemas/daily-health-data.schema.json`
- `schemas/portable-backup-manifest.schema.json`
- `scripts/build-ai-handoff.mjs`
- `scripts/validate-foundation.mjs`
- `security/AIDataSharingPolicy.md`
- `security/DataClassification.md`
- `security/IncidentResponse.md`
- `security/LocalPrivateFiles.md`
- `security/PrivacyAudit-Initial.md`
- `security/PrivacyModel.md`
- `security/README.md`
- `security/SecretsPolicy.md`
- `src/__tests__/foundationScripts.test.js`

### Modified

- `.gitignore`
- `README.md`
- `package.json`
- `src/data/sampleData.js`

## Branch

`sprint/001-foundation-privacy-portability`

## Commit

Pending.

## PR

Pending.
