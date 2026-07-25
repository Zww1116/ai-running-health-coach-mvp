---
title: Versioning Policy
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# Versioning Policy

Project foundation files start at `0.1.0`. Schema, prompt and agent versions move independently because they can change at different speeds.

Patch versions cover wording, clarification and non-breaking additions. Minor versions cover new fields, new agent rules or new prompt sections. Major versions cover incompatible schema or workflow changes.

Generated exports are not formal sources. They must record the source versions used to generate them.
