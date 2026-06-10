// ─── WhatsApp Link Generator ──────────────────────────────────────────────────

export function generateWaLink(phone: string, customerName: string, plate: string, status: string): string {
  // Normalize phone: 08xx → 628xx
  let normalized = phone.trim()
  if (normalized.startsWith('08')) {
    normalized = '62' + normalized.slice(1)
  } else if (normalized.startsWith('+62')) {
    normalized = normalized.slice(1)
  }

  const message = `Halo ${customerName}, status dokumen ${plate} Anda: ${status}. Terima kasih.`
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
