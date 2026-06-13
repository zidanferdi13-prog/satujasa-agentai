#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

failures=0

pass() {
  printf '✅ %s\n' "$1"
}

fail() {
  printf '❌ %s\n' "$1" >&2
  failures=$((failures + 1))
}

require_file() {
  local file="$1"
  local label="$2"
  if [[ -f "$file" ]]; then
    pass "$label exists ($file)"
  else
    fail "$label missing ($file)"
  fi
}

require_file "app/app/transactions/index.tsx" "transactions list route"
require_file "app/app/transactions/new.tsx" "new transaction route"
require_file "app/app/transactions/[id].tsx" "transaction detail route"
require_file "src/contracts.ts" "standalone mobile contracts"
require_file "eas.json" "EAS config"
require_file "app.json" "Expo app config"

if ! node <<'NODE'
const fs = require('fs');
const appConfigPath = 'app.json';
const appConfig = JSON.parse(fs.readFileSync(appConfigPath, 'utf8'));
const expo = appConfig.expo ?? {};
const checks = [
  ['expo.owner', expo.owner],
  ['expo.extra.eas.projectId', expo.extra?.eas?.projectId],
  ['expo.android.package', expo.android?.package],
];
let failed = false;
for (const [label, value] of checks) {
  if (typeof value === 'string' && value.trim().length > 0) {
    console.log(`✅ ${label} configured`);
  } else {
    console.error(`❌ ${label} missing in app.json`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
NODE
then
  failures=$((failures + 1))
fi

if ! node <<'NODE'
const fs = require('fs');
const path = require('path');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const hasWorkspaceContract = sections.some((section) => pkg[section]?.['@stnk/contracts']);
if (hasWorkspaceContract) {
  console.error('❌ package.json depends on @stnk/contracts; mobile should remain standalone');
  process.exit(1);
}
console.log('✅ package.json has no @stnk/contracts dependency');

const roots = ['app', 'src'];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const offenders = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!extensions.has(path.extname(entry.name))) continue;
    const content = fs.readFileSync(full, 'utf8');
    if (content.includes('@stnk/contracts')) offenders.push(full);
  }
}
roots.forEach(walk);
if (offenders.length > 0) {
  console.error('❌ Found @stnk/contracts imports in mobile source:');
  offenders.forEach((file) => console.error(`   - ${file}`));
  process.exit(1);
}
console.log('✅ mobile source has no @stnk/contracts imports');
NODE
then
  failures=$((failures + 1))
fi

if [[ "$failures" -gt 0 ]]; then
  printf '\nMobile smoke check failed with %s issue(s).\n' "$failures" >&2
  exit 1
fi

printf '\nMobile smoke check passed.\n'
