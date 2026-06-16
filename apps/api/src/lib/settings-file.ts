import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const SETTINGS_PATH = join(import.meta.dirname, '../../settings.json')

const DEFAULTS: Record<string, string> = {
  app_name: 'STNK Jasa',
  support_email: 'support@satujasa.my.id',
  support_phone: '081234567890',
}

function validate(settings: unknown): settings is Record<string, string> {
  if (!settings || typeof settings !== 'object') return false
  const obj = settings as Record<string, unknown>
  return (
    typeof obj.app_name === 'string' &&
    typeof obj.support_email === 'string' &&
    typeof obj.support_phone === 'string'
  )
}

export async function readSettingsFromFile(): Promise<Record<string, string>> {
  try {
    const raw = await readFile(SETTINGS_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    if (validate(parsed)) return parsed
  } catch {
    // File missing or corrupted — return defaults
  }
  return { ...DEFAULTS }
}

export async function writeSettingsToFile(body: unknown): Promise<void> {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid settings payload')
  }
  const patch = body as Record<string, unknown>
  const current = await readSettingsFromFile()

  if (typeof patch.app_name === 'string') current.app_name = patch.app_name
  if (typeof patch.support_email === 'string') current.support_email = patch.support_email
  if (typeof patch.support_phone === 'string') current.support_phone = patch.support_phone

  await writeFile(SETTINGS_PATH, JSON.stringify(current, null, 2) + '\n', 'utf-8')
}
