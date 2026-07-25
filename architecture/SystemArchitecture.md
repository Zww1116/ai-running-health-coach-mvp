---
title: System Architecture
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# System Architecture

The system is organized into six layers.

## 1. Project Governance Layer

Documents, ADRs, sprint records, source-of-truth rules and handoff instructions.

## 2. Brand and Product Asset Layer

Brand DNA, product direction, requirements and roadmap. These are project assets, not private health data.

## 3. Application Code Layer

React, Vite, Tailwind, runtime agents, storage adapters, import adapters and local server utilities in `src/` and `server/`.

## 4. Private Data Layer

User health records, images, private profile, backups and future private database rows. These must remain outside Git.

## 5. Data Contract Layer

Draft JSON Schemas in `schemas/` define portable data shapes for records, analysis packets, AI outputs and backup manifests.

## 6. Replaceable AI Provider Layer

Rule-based logic, OpenAI, Anthropic, Gemini and local models should fit behind provider-specific adapters while preserving shared input and output contracts.
