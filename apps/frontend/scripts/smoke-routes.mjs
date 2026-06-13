import fs from 'node:fs';
import path from 'node:path';

const appRoot = process.cwd();
const checks = [
  {
    label: '/owner/laporan',
    file: 'src/app/owner/laporan/page.tsx',
    urlPath: '/owner/laporan',
  },
  {
    label: '/user-admin/transaksi',
    file: 'src/app/user-admin/transaksi/page.tsx',
    urlPath: '/user-admin/transaksi',
  },
  {
    label: '/user-admin/transaksi/[id]',
    file: 'src/app/user-admin/transaksi/[id]/page.tsx',
  },
  {
    label: '/monitoring/[token]',
    file: 'src/app/monitoring/[token]/page.tsx',
  },
];

function ok(message) {
  console.log(`✓ ${message}`);
}

function fail(message) {
  console.error(`✗ ${message}`);
}

function normalizeBaseUrl(value) {
  if (!value) return '';
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

async function checkStaticRoutes() {
  let failures = 0;
  for (const check of checks) {
    const fullPath = path.join(appRoot, check.file);
    if (fs.existsSync(fullPath)) {
      ok(`${check.label} route file exists (${check.file})`);
    } else {
      failures += 1;
      fail(`${check.label} route file missing (${check.file})`);
    }
  }
  return failures;
}

async function checkHttpRoutes(baseUrl) {
  const urls = checks
    .filter((check) => check.urlPath)
    .map((check) => ({ ...check, url: `${baseUrl}${check.urlPath}` }));

  if (!urls.length) return 0;

  let failures = 0;
  for (const check of urls) {
    try {
      const response = await fetch(check.url, { method: 'GET', redirect: 'manual' });
      if (response.status >= 200 && response.status < 500) {
        ok(`${check.label} responded with HTTP ${response.status}`);
      } else {
        failures += 1;
        fail(`${check.label} responded with HTTP ${response.status}`);
      }
    } catch (error) {
      failures += 1;
      fail(`${check.label} request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return failures;
}

const baseUrl = normalizeBaseUrl(process.env.SMOKE_WEB_BASE_URL);
console.log('Frontend route smoke checks');
console.log(`App root: ${appRoot}`);

const staticFailures = await checkStaticRoutes();
let httpFailures = 0;

if (baseUrl) {
  console.log(`SMOKE_WEB_BASE_URL: ${baseUrl}`);
  httpFailures = await checkHttpRoutes(baseUrl);
} else {
  ok('SMOKE_WEB_BASE_URL not set; skipped optional HTTP checks');
}

const failures = staticFailures + httpFailures;
if (failures > 0) {
  fail(`${failures} smoke check(s) failed`);
  process.exit(1);
}

ok('all smoke checks passed');
