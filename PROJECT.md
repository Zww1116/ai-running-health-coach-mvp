---
title: Project Entry
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: founder
source_of_truth: true
---

# Project Overview

This repository contains a working personal AI health decision platform. The current product helps a user collect training, nutrition, sleep, recovery, pain and cycle data, then uses local rule-based specialist agents to produce daily and weekly coaching guidance.

## Current Positioning

The current positioning is: personal AI health decision and growth companion. The broader V2 direction is Personal AI Health OS, organized around getting data, analyzing with multiple specialists, making a head-coach decision, executing, and reviewing.

## Current Brand Core

The current proposed brand core is: remember the path, understand yourself, become yourself. The brand name is not finalized.

## Current Product

The first product is an AI-assisted health and training management system for runners. It is usable as a React web application and has a public deployment path through GitHub Pages or Vercel.

## Current Phase

The project is in Phase 0 and Phase 1 overlap: governance, privacy foundation, product and data foundation.

## Current Technical Status

The app uses React, Vite and Tailwind. It includes local rule-based agents, local browser storage, optional Supabase synchronization, local image storage in IndexedDB, COROS file-import foundations, and a local Ollama nutrition estimation adapter.

## Current Data Storage Status

Personal health records are primarily stored in the user's browser. Supabase is optional or reserved as a user-selected cloud synchronization capability. GitHub does not store raw personal health data.

## Current Privacy Boundary

Project assets may live in Git. Private health records, health images, exports, database files and secrets must not be committed. Any AI sharing must use explicit user review and a minimized analysis packet.

## Current Implemented Capabilities

- Running, strength, nutrition, body, sleep, cycle and pain records.
- Rule-based specialist agents and head-coach aggregation.
- Data center entry points for imports, sleep, nutrition images and manual records.
- Local image upload and preview through browser storage.
- Optional Supabase auth and row-level-security backed record sync.
- COROS import foundations for activity files.

## Current Main Limitations

- No real OpenAI, Claude or Gemini API integration is enabled.
- Image recognition is local or placeholder-first, not a hosted production AI service.
- Long-term cloud backup and restore are not yet a complete user-facing workflow.
- Current schemas are draft and do not yet drive runtime validation.

## Current Sprint

Sprint 001: Project Foundation, Privacy and AI Portability.

## Next Plan

Finish the governance, privacy, schema, prompt and AI handoff foundation before adding more product features.

## Document Navigation

- Project governance: [project/README.md](project/README.md)
- Current status: [project/CurrentStatus.md](project/CurrentStatus.md)
- Source of truth: [project/SourceOfTruth.md](project/SourceOfTruth.md)
- Brand core: [brand/00_BrandDNA.md](brand/00_BrandDNA.md)
- Architecture: [architecture/README.md](architecture/README.md)
- Security: [security/README.md](security/README.md)
- Migration: [migration/AI_HANDOFF.md](migration/AI_HANDOFF.md)

## Confirmed Items

- Use one main GitHub repository for the current stage.
- Keep private health data separate from project assets.
- Keep AI providers replaceable.

## Unconfirmed Items

- Final brand name.
- License and repository visibility strategy.
- Final production AI provider.
- Final long-term backup product flow.

## Single Source Statement

Chat history is not a formal project source. Each important asset has one formal source listed in [project/SourceOfTruth.md](project/SourceOfTruth.md). README files should introduce and navigate, not duplicate detailed rules.
