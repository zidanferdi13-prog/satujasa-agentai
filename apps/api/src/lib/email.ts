/**
 * Email notification utility for STNK Jasa.
 *
 * Current implementation: logging-based (prints to console).
 * Swap the sendEmail body to use Nodemailer / Resend / Mailgun SMTP in production.
 */

export interface EmailOptions {
  to: string
  subject: string
  body: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Logging-based email sending for development
  // Replace with actual SMTP/API integration in production:
  //   const transporter = nodemailer.createTransport({ ... })
  //   await transporter.sendMail({ from: 'no-reply@satujasa.my.id', ...options })
  console.log(`[EMAIL] To: ${options.to}\n  Subject: ${options.subject}\n  Body: ${options.body}`)
}

// ─── Subscription Expiry Templates ───────────────────────────────────────────

export interface ExpiryTemplateData {
  ownerEmail: string
  ownerName?: string
  tier: string
  expiresAt: string
}

/**
 * 7-day warning: subscription will expire in 7 days.
 */
export function templateExpiry7Day(data: ExpiryTemplateData): EmailOptions {
  return {
    to: data.ownerEmail,
    subject: '⏰ Subscription Anda akan berakhir dalam 7 hari',
    body: `Halo ${data.ownerName || data.ownerEmail},\n\n` +
      `Subscription ${data.tier.toUpperCase()} Anda akan berakhir pada ${data.expiresAt} (7 hari lagi).\n\n` +
      `Silakan perpanjang untuk tetap menikmati fitur premium:\n` +
      `- Tenant tanpa batas\n` +
      `- Admin user tanpa batas\n` +
      `- Prioritas support\n\n` +
      `Login ke dashboard: https://satujasa.my.id\n\n` +
      `Terima kasih,\nTim STNK Jasa`,
  }
}

/**
 * 3-day warning: subscription will expire in 3 days.
 */
export function templateExpiry3Day(data: ExpiryTemplateData): EmailOptions {
  return {
    to: data.ownerEmail,
    subject: '⚠️ Subscription Anda akan berakhir dalam 3 hari',
    body: `Halo ${data.ownerName || data.ownerEmail},\n\n` +
      `Subscription ${data.tier.toUpperCase()} Anda akan berakhir pada ${data.expiresAt} — hanya 3 hari lagi!\n\n` +
      `Setelah masa berlaku habis, akun Anda akan otomatis kembali ke tier Free:\n` +
      `- Maksimal 1 tenant\n` +
      `- Maksimal 1 admin user\n\n` +
      `Perpanjang sekarang: https://satujasa.my.id\n\n` +
      `Butuh bantuan? Balas email ini.\n\n` +
      `Terima kasih,\nTim STNK Jasa`,
  }
}

/**
 * Expired notification: subscription has ended.
 */
export function templateExpiryExpired(data: ExpiryTemplateData): EmailOptions {
  return {
    to: data.ownerEmail,
    subject: '🔔 Subscription Anda telah berakhir',
    body: `Halo ${data.ownerName || data.ownerEmail},\n\n` +
      `Subscription ${data.tier.toUpperCase()} Anda telah berakhir pada ${data.expiresAt}.\n\n` +
      `Akun Anda sekarang menggunakan tier Free dengan batasan:\n` +
      `- Maksimal 1 tenant\n` +
      `- Maksimal 1 admin user\n\n` +
      `Upgrade lagi kapan saja: https://satujasa.my.id\n\n` +
      `Terima kasih,\nTim STNK Jasa`,
  }
}
