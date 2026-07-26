export const TASK_MIN_LENGTH = 1
export const TASK_MAX_LENGTH = 160
export const SHORTCUT_MIN_LABEL_LENGTH = 1
export const SHORTCUT_MAX_LABEL_LENGTH = 32
export const SHORTCUT_MAX_COUNT = 12

export const ALLOWED_SCHEMES = ['https:', 'http:']
export const DANGEROUS_SCHEMES = ['javascript:', 'data:', 'file:', 'chrome:', 'about:', 'mailto:', 'tel:']

export function normalizeUrl(candidate: string): string {
  let trimmed = candidate.trim()
  if (!trimmed) return trimmed
  if (!/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(trimmed)) {
    trimmed = 'https://' + trimmed
  }
  try {
    const url = new URL(trimmed)
    if (!ALLOWED_SCHEMES.includes(url.protocol)) {
      throw new Error(`Protocol not allowed: ${url.protocol}`)
    }
    return url.toString()
  } catch {
    throw new Error('Invalid URL')
  }
}

export function isDangerousUrl(candidate: string): boolean {
  const lower = candidate.trim().toLowerCase()
  return DANGEROUS_SCHEMES.some((s) => lower.startsWith(s))
}

export function validateTaskTitle(title: string): string | null {
  const trimmed = title.trim()
  if (!trimmed) return 'Task cannot be empty.'
  if (trimmed.length > TASK_MAX_LENGTH) return `Task must be ${TASK_MAX_LENGTH} characters or fewer.`
  return null
}

export function validateShortcutLabel(label: string): string | null {
  const trimmed = label.trim()
  if (!trimmed) return 'Label cannot be empty.'
  if (trimmed.length > SHORTCUT_MAX_LABEL_LENGTH) return `Label must be ${SHORTCUT_MAX_LABEL_LENGTH} characters or fewer.`
  return null
}

export function buildGoogleSearchUrl(query: string): string {
  return 'https://www.google.com/search?' + new URLSearchParams({ q: query }).toString()
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}

export function isLocalhost(hostname: string): boolean {
  const lower = hostname.toLowerCase()
  return (
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower === '::1' ||
    lower === '0.0.0.0' ||
    lower.endsWith('.local') ||
    lower.startsWith('192.168.') ||
    lower.startsWith('10.') ||
    lower.startsWith('172.16.') ||
    lower.startsWith('172.17.') ||
    lower.startsWith('172.18.') ||
    lower.startsWith('172.19.') ||
    lower.startsWith('172.2') ||
    lower.startsWith('172.3')
  )
}

export function getFaviconUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (isLocalhost(u.hostname)) return null
    if (typeof chrome !== 'undefined' && chrome.runtime && 'id' in chrome.runtime) {
      const runtime = chrome.runtime as typeof chrome.runtime & { getURL: (path: string) => string }
      const base = runtime.getURL('/_favicon/')
      return `${base}?pageUrl=${encodeURIComponent(url)}&size=64`
    }
    return `https://${u.hostname}/favicon.ico`
  } catch {
    return null
  }
}