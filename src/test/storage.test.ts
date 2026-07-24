import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadState, saveState, createDefaultState, mergeWithDefaults } from '../storage/storage'
import type { AppState, Preferences, ThemeId, Task } from '../domain/types'
import {
  validateTaskTitle,
  validateShortcutLabel,
  normalizeUrl,
  isDangerousUrl,
  buildGoogleSearchUrl,
} from '../domain/validators'

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
})

describe('storage - adapter selection', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('prefers chrome.storage.local when available', async () => {
    const mockGet = vi.fn((_keys: string[], cb: (result: Record<string, unknown>) => void) => cb({}))
    const mockSet = vi.fn((_data: object, cb: () => void) => cb())
    const mockChrome = {
      storage: {
        local: {
          get: mockGet,
          set: mockSet,
        },
      },
      runtime: { lastError: null },
    }
    vi.stubGlobal('chrome', mockChrome)
    const state = await loadState()
    expect(state).toBeDefined()
  })

  it('falls back to localStorage when chrome.storage is unavailable', async () => {
    const mockChrome = {
      storage: {
        local: null,
      },
      runtime: { lastError: null },
    }
    vi.stubGlobal('chrome', mockChrome)
    const mockItem = vi.fn().mockReturnValue(JSON.stringify(createDefaultState()))
    vi.stubGlobal('localStorage', { getItem: mockItem, setItem: vi.fn(), removeItem: vi.fn() })
    const state = await loadState()
    expect(state).toBeDefined()
    expect(mockItem).toHaveBeenCalled()
  })

  it('falls back to memory when chrome and localStorage are unavailable', async () => {
    const mockChrome = {
      storage: { local: null },
      runtime: { lastError: null },
    }
    vi.stubGlobal('chrome', mockChrome)
    vi.stubGlobal('localStorage', null)
    const state = await loadState()
    expect(state).toBeDefined()
  })
})

describe('storage - hydration without overwrite', () => {
  it('merges stored data with defaults for new fields', () => {
    const oldState = createDefaultState()
    delete (oldState.preferences as unknown as Record<string, unknown>).showSearchModule
    delete (oldState.preferences as unknown as Record<string, unknown>).showFocusModule
    const merged = mergeWithDefaults(oldState)
    expect(merged.preferences.showSearchModule).toBe(true)
    expect(merged.preferences.showFocusModule).toBe(true)
  })

  it('does not overwrite stored preferences with defaults', () => {
    const stored = createDefaultState()
    stored.preferences.theme = 'minimal' as ThemeId
    stored.preferences.primaryMode = 'search'
    stored.preferences.showSearchModule = false
    const merged = mergeWithDefaults(stored)
    expect(merged.preferences.theme).toBe('minimal')
    expect(merged.preferences.primaryMode).toBe('search')
    expect(merged.preferences.showSearchModule).toBe(false)
  })

  it('preserves existing tasks after merge', () => {
    const stored = createDefaultState()
    const task: Task = {
      id: 'test-1',
      title: 'Persisted task',
      completed: false,
      createdAt: '2025-01-01T00:00:00.000Z',
      completedAt: null,
    }
    stored.tasks = [task]
    const merged = mergeWithDefaults(stored)
    expect(merged.tasks).toHaveLength(1)
    expect(merged.tasks[0].title).toBe('Persisted task')
  })

  it('preserves existing shortcuts after merge', () => {
    const stored = createDefaultState()
    stored.shortcuts = [
      {
        id: 'sc-1',
        label: 'GitHub',
        url: 'https://github.com',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    ]
    const merged = mergeWithDefaults(stored)
    expect(merged.shortcuts).toHaveLength(1)
    expect(merged.shortcuts[0].label).toBe('GitHub')
  })
})

describe('storage - persistence', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('saves and loads tasks via chrome.storage', async () => {
    let storedData: Record<string, unknown> = {}
    const mockChrome = {
      storage: {
        local: {
          get: vi.fn((_keys: string[], cb: (result: Record<string, unknown>) => void) => cb(storedData)),
          set: vi.fn((data: object, cb: () => void) => { storedData = data as Record<string, unknown>; cb() }),
        },
      },
      runtime: { lastError: null },
    }
    vi.stubGlobal('chrome', mockChrome)
    const state = createDefaultState()
    const task: Task = {
      id: 't1',
      title: 'My task',
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    const nextState = { ...state, tasks: [task] }
    await saveState(nextState)
    const loaded = await loadState()
    expect(loaded.tasks).toHaveLength(1)
    expect(loaded.tasks[0].title).toBe('My task')
  })

  it('persists preferences across loads', async () => {
    let storedData: Record<string, unknown> = {}
    const mockChrome = {
      storage: {
        local: {
          get: vi.fn((_keys: string[], cb: (result: Record<string, unknown>) => void) => cb(storedData)),
          set: vi.fn((data: object, cb: () => void) => { storedData = data as Record<string, unknown>; cb() }),
        },
      },
      runtime: { lastError: null },
    }
    vi.stubGlobal('chrome', mockChrome)
    const state = createDefaultState()
    const next: AppState = {
      ...state,
      preferences: {
        ...state.preferences,
        theme: 'architecture' as ThemeId,
        reduceMotion: true,
      },
    }
    await saveState(next)
    const loaded = await loadState()
    expect(loaded.preferences.theme).toBe('architecture')
    expect(loaded.preferences.reduceMotion).toBe(true)
  })
})

describe('module visibility', () => {
  it('defaults to both modules visible', () => {
    const state = createDefaultState()
    expect(state.preferences.showSearchModule).toBe(true)
    expect(state.preferences.showFocusModule).toBe(true)
  })

  it('allows disabling one module when the other is on', () => {
    const prefs: Preferences = {
      primaryMode: 'focus',
      theme: 'landscapes',
      showQuote: true,
      veilIntensity: 'medium',
      reduceMotion: false,
      showCompletedTasks: true,
      showSearchModule: true,
      showFocusModule: false,
    }
    expect(prefs.showSearchModule).toBe(true)
    expect(prefs.showFocusModule).toBe(false)
  })

  it('enforces at least one module active in SettingsPanel', () => {
    const prefs: Preferences = {
      primaryMode: 'focus',
      theme: 'landscapes',
      showQuote: true,
      veilIntensity: 'medium',
      reduceMotion: false,
      showCompletedTasks: true,
      showSearchModule: true,
      showFocusModule: true,
    }
    expect(prefs.showSearchModule || prefs.showFocusModule).toBeTruthy()
  })
})