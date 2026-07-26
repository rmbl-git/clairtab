import { describe, it, expect } from 'vitest'
import { validateTaskTitle, validateShortcutLabel, normalizeUrl, isDangerousUrl, buildGoogleSearchUrl, isLocalhost, getFaviconUrl } from '../domain/validators'

describe('validators', () => {
  it('validates task title', () => {
    expect(validateTaskTitle('')).toBe('Task cannot be empty.')
    expect(validateTaskTitle('   ')).toBe('Task cannot be empty.')
    expect(validateTaskTitle('x'.repeat(161))).toBe('Task must be 160 characters or fewer.')
    expect(validateTaskTitle('Valid task')).toBeNull()
  })

  it('validates shortcut label', () => {
    expect(validateShortcutLabel('')).toBe('Label cannot be empty.')
    expect(validateShortcutLabel('x'.repeat(33))).toBe('Label must be 32 characters or fewer.')
    expect(validateShortcutLabel('Valid')).toBeNull()
  })

  it('normalizes URLs', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com/')
    expect(normalizeUrl('https://example.com/path')).toBe('https://example.com/path')
    expect(normalizeUrl('http://example.com')).toBe('http://example.com/')
  })

  it('rejects dangerous URLs', () => {
    expect(isDangerousUrl('javascript://evil.com')).toBe(true)
    expect(isDangerousUrl('data:text/html,<script>')).toBe(true)
    expect(isDangerousUrl('file:///etc/passwd')).toBe(true)
    expect(isDangerousUrl('https://safe.com')).toBe(false)
  })

  it('builds Google search URL', () => {
    const url = buildGoogleSearchUrl('hello world')
    expect(url).toBe('https://www.google.com/search?q=hello+world')
  })

  it('detects localhost hosts', () => {
    expect(isLocalhost('localhost')).toBe(true)
    expect(isLocalhost('127.0.0.1')).toBe(true)
    expect(isLocalhost('::1')).toBe(true)
    expect(isLocalhost('0.0.0.0')).toBe(true)
    expect(isLocalhost('myapp.local')).toBe(true)
    expect(isLocalhost('192.168.1.1')).toBe(true)
    expect(isLocalhost('10.0.0.1')).toBe(true)
    expect(isLocalhost('example.com')).toBe(false)
    expect(isLocalhost('github.com')).toBe(false)
  })

  it('returns favicon URL for remote hosts', () => {
    expect(getFaviconUrl('https://github.com')).toBe('https://github.com/favicon.ico')
    expect(getFaviconUrl('https://example.com/path')).toBe('https://example.com/favicon.ico')
  })

  it('returns null for localhost favicons', () => {
    expect(getFaviconUrl('http://localhost:3000')).toBeNull()
    expect(getFaviconUrl('http://127.0.0.1:8080')).toBeNull()
  })

  it('returns null for invalid URLs', () => {
    expect(getFaviconUrl('not-a-url')).toBeNull()
  })
})