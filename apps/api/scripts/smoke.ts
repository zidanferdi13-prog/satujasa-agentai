import 'dotenv/config'

type CheckResult = 'PASS' | 'FAIL' | 'SKIP'

type Credentials = {
  email: string
  password: string
}

const DEFAULT_BASE_URL = 'http://localhost:4000/api/v1'
const baseUrl = normalizeBaseUrl(process.env.SMOKE_BASE_URL || DEFAULT_BASE_URL)

function normalizeBaseUrl(value: string) {
  return value.replace(/\/$/, '')
}

function readCredentials(prefix: string): Credentials | null {
  const email = process.env[`${prefix}_EMAIL`]
  const password = process.env[`${prefix}_PASSWORD`]
  if (!email || !password) return null
  return { email, password }
}

async function requestJson(path: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${path}`, init)
  const text = await response.text()
  let body: unknown = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
  }
  return { response, body }
}

async function login(credentials: Credentials) {
  const { response, body } = await requestJson('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok || !body || typeof body !== 'object' || !('accessToken' in body)) {
    throw new Error(`login failed with status ${response.status}`)
  }

  const token = body.accessToken
  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('login response missing accessToken')
  }
  return token
}

async function runCheck(name: string, check: () => Promise<{ result: CheckResult; note?: string }>) {
  try {
    const { result, note } = await check()
    console.log(`${result.padEnd(4)} ${name}${note ? ` — ${note}` : ''}`)
    return result
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.log(`FAIL ${name} — ${message}`)
    return 'FAIL'
  }
}

async function main() {
  console.log(`STNK API smoke suite`)
  console.log(`Base URL: ${baseUrl}`)
  console.log('Credentials: loaded from SMOKE_* env vars only\n')

  const results: CheckResult[] = []

  results.push(await runCheck('GET /health', async () => {
    const { response } = await requestJson('/health')
    return {
      result: response.status === 200 ? 'PASS' : 'FAIL',
      note: `status ${response.status}`,
    }
  }))

  results.push(await runCheck('Owner login + GET /owner/report', async () => {
    const credentials = readCredentials('SMOKE_OWNER')
    if (!credentials) {
      return { result: 'SKIP', note: 'SMOKE_OWNER_EMAIL/SMOKE_OWNER_PASSWORD not set' }
    }

    const token = await login(credentials)
    const { response } = await requestJson('/owner/report', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return {
      result: response.status === 200 ? 'PASS' : 'FAIL',
      note: `status ${response.status}`,
    }
  }))

  results.push(await runCheck('Admin-user login + GET /admin-user/transactions', async () => {
    const credentials = readCredentials('SMOKE_ADMIN_USER')
    if (!credentials) {
      return { result: 'SKIP', note: 'SMOKE_ADMIN_USER_EMAIL/SMOKE_ADMIN_USER_PASSWORD not set' }
    }

    const token = await login(credentials)
    const { response } = await requestJson('/admin-user/transactions', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return {
      result: response.status === 200 ? 'PASS' : 'FAIL',
      note: `status ${response.status}`,
    }
  }))

  results.push(await runCheck('Public monitoring token GET /monitoring/:token', async () => {
    const token = process.env.SMOKE_MONITORING_TOKEN
    if (!token) {
      return { result: 'SKIP', note: 'SMOKE_MONITORING_TOKEN not set' }
    }

    const { response } = await requestJson(`/monitoring/${encodeURIComponent(token)}`)
    return {
      result: response.status === 200 ? 'PASS' : 'FAIL',
      note: `status ${response.status}`,
    }
  }))

  const failed = results.filter((result) => result === 'FAIL').length
  const passed = results.filter((result) => result === 'PASS').length
  const skipped = results.filter((result) => result === 'SKIP').length

  console.log(`\nSummary: ${passed} passed, ${skipped} skipped, ${failed} failed`)
  if (failed > 0) process.exit(1)
}

await main()
