import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const requiredFiles = [
  'PROJECT.md',
  'project/README.md',
  'project/INDEX.md',
  'project/CurrentStatus.md',
  'project/Roadmap.md',
  'project/Backlog.md',
  'project/SourceOfTruth.md',
  'project/DefinitionOfDone.md',
  'project/FileManagementRules.md',
  'project/VersioningPolicy.md',
  'project/DecisionCaptureWorkflow.md',
  'project/templates/Sprint-TEMPLATE.md',
  'project/templates/ADR-TEMPLATE.md',
  'project/templates/Confirmed-Decision-Prompt.md',
  'project/sprints/Sprint-001-Foundation-Privacy-Portability.md',
  'project/decisions/README.md',
  'project/decisions/ADR-0001-Single-Repository.md',
  'project/decisions/ADR-0002-Private-Data-Separation.md',
  'project/decisions/ADR-0003-Replaceable-AI-Providers.md',
  'project/decisions/ADR-0004-Repository-Visibility-And-Licensing.md',
  'project/archive/README.md',
  'brand/README.md',
  'brand/00_BrandDNA.md',
  'product/README.md',
  'architecture/README.md',
  'architecture/SystemArchitecture.md',
  'architecture/DataOwnershipAndBoundaries.md',
  'architecture/DataFlow.md',
  'architecture/AIProviderPortability.md',
  'architecture/BackupAndRecovery.md',
  'security/README.md',
  'security/PrivacyModel.md',
  'security/DataClassification.md',
  'security/SecretsPolicy.md',
  'security/AIDataSharingPolicy.md',
  'security/LocalPrivateFiles.md',
  'security/IncidentResponse.md',
  'security/PrivacyAudit-Initial.md',
  'knowledge/README.md',
  'agents/README.md',
  'prompts/README.md',
  'prompts/core/README.md',
  'prompts/platforms/chatgpt/README.md',
  'prompts/platforms/claude/README.md',
  'prompts/platforms/gemini/README.md',
  'prompts/platforms/local/README.md',
  'schemas/README.md',
  'schemas/daily-health-data.schema.json',
  'schemas/analysis-packet.schema.json',
  'schemas/ai-analysis-result.schema.json',
  'schemas/portable-backup-manifest.schema.json',
  'api/README.md',
  'migration/README.md',
  'migration/AI_HANDOFF.md',
  'migration/manifest.json',
  'migration/NEW_AI_BOOTSTRAP_PROMPT.md',
  'migration/MIGRATION_CHECKLIST.md',
  'migration/RESTORE_TEST.md',
  'migration/PRIVATE_CONTEXT_TEMPLATE.md',
  'migration/EXCLUDED_DATA.md',
  'scripts/build-ai-handoff.mjs',
  'scripts/validate-foundation.mjs',
];
const requiredGitignoreRules = [
  '.env',
  '.env.*',
  '!.env.example',
  'exports/',
  'backups/',
  'private-data/',
  'private-profile/',
  '*.health-backup.zip',
  '*.health-backup.json',
  '*.private-context.md',
  '*.sqlite',
  '*.sqlite3',
  '*.db',
  '*.pem',
  '*.key',
  '*.p12',
  '*.pfx',
];

const errors = [];
const warnings = [];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(rootDir, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

for (const relativePath of requiredFiles.filter((file) => file.endsWith('.md'))) {
  const source = readText(relativePath);
  if (!source.startsWith('---\n')) {
    errors.push(`Missing front matter: ${relativePath}`);
  }
  if (/^#\s.+\n\s*$/s.test(source)) {
    errors.push(`Markdown file appears empty: ${relativePath}`);
  }
}

for (const relativePath of requiredFiles.filter((file) => file.endsWith('.json'))) {
  try {
    JSON.parse(readText(relativePath));
  } catch (error) {
    errors.push(`Invalid JSON in ${relativePath}: ${error.message}`);
  }
}

const manifest = JSON.parse(readText('migration/manifest.json'));
for (const relativePath of manifest.requiredFiles ?? []) {
  if (!fs.existsSync(path.join(rootDir, relativePath))) {
    errors.push(`Manifest required file is missing: ${relativePath}`);
  }
}
for (const includePath of manifest.include ?? []) {
  if (!fs.existsSync(path.join(rootDir, includePath))) {
    errors.push(`Manifest include path is missing: ${includePath}`);
  }
}

const gitignore = readText('.gitignore');
for (const rule of requiredGitignoreRules) {
  if (!gitignore.split(/\r?\n/).includes(rule)) {
    errors.push(`Missing .gitignore rule: ${rule}`);
  }
}
if (gitignore.split(/\r?\n/).includes('migration/PRIVATE_CONTEXT_TEMPLATE.md')) {
  errors.push('migration/PRIVATE_CONTEXT_TEMPLATE.md must not be ignored.');
}

if (fs.existsSync(path.join(rootDir, 'exports', 'AI-Core-Pack', 'private-data'))) {
  errors.push('AI-Core-Pack contains private-data directory.');
}
if (fs.existsSync(path.join(rootDir, 'exports', 'AI-Core-Pack', '.env'))) {
  errors.push('AI-Core-Pack contains .env.');
}

if (warnings.length > 0) {
  console.log(`Foundation validation warnings: ${warnings.length}`);
}
if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Foundation validation passed');

function readText(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}
