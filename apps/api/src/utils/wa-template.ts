import type { TransactionStatus } from '@stnk/contracts'
import { STATUS_LABELS } from './transaction-state-machine.js'

export interface WaTemplateParams {
  customer_name: string
  customer_phone: string
  service_name: string
  current_status: TransactionStatus
  total_cost: string
  additional_cost: string
  monitoring_token: string
  tenant_name: string
  base_url: string
}

/**
 * Generates a WhatsApp message template for transaction status updates.
 */
export function generateWaTemplate(params: WaTemplateParams): string {
  const {
    customer_name,
    service_name,
    current_status,
    total_cost,
    additional_cost,
    monitoring_token,
    tenant_name,
    base_url,
  } = params

  const monitoringUrl = `${base_url}/monitoring/${monitoring_token}`
  const statusLabel = STATUS_LABELS[current_status]

  let message = `Halo ${customer_name}, berikut update berkas Anda:\n\n`
  message += `Layanan: ${service_name}\n`
  message += `Status: ${statusLabel}\n`
  message += `Biaya Total: Rp ${formatCurrency(total_cost)}\n`

  const additionalNum = parseFloat(additional_cost)
  if (additionalNum > 0) {
    message += `Biaya Tambahan: Rp ${formatCurrency(additional_cost)}\n`
  }

  message += `\nPantau progres: ${monitoringUrl}\n\n`
  message += `Terima kasih - ${tenant_name}`

  return message
}

/**
 * Generates a full WhatsApp URL with pre-filled message.
 */
export function generateWaLink(params: WaTemplateParams): { url: string; template: string } {
  const template = generateWaTemplate(params)
  const phone = normalizePhone(params.customer_phone)
  const encodedMessage = encodeURIComponent(template)
  const url = `https://wa.me/${phone}?text=${encodedMessage}`

  return { url, template }
}

/**
 * Normalize phone number: remove leading 0, add 62 prefix if needed.
 */
function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, '')
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1)
  }
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1)
  }
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned
  }
  return cleaned
}

/**
 * Format number as Indonesian currency string.
 */
function formatCurrency(value: string): string {
  const num = parseFloat(value)
  if (isNaN(num)) return '0'
  return num.toLocaleString('id-ID')
}
