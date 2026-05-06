export function normalizeRegionCode(code) {
  if (typeof code !== 'string') {
    return null
  }

  const trimmed = code.trim().toUpperCase()
  if (!trimmed) {
    return null
  }

  return trimmed.startsWith('RU-') ? trimmed.slice(3) : trimmed
}
