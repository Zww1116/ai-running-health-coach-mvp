---
title: Excluded Data
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# Excluded Data

The AI handoff pack excludes `.env`, `.env.*`, `node_modules/`, `dist/`, `exports/`, `backups/`, `private-data/`, `private-profile/`, database files, health images, private exports, logs, Git internals, API keys, secrets and tokens.

Generated handoff files are project-context exports only and are not formal sources.
