---
title: Backup and Recovery
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# Backup and Recovery

Future backups should be user-controlled, portable and clearly separated from Git. A backup package may include health records, analysis history, reports, attachments index, schema versions and checksums.

Backups should not be uploaded automatically. The user should be able to export, inspect, store a second copy, restore and delete.

This sprint creates only schemas and migration handoff files. It does not export private health records.
