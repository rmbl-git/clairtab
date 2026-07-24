import type { AppState, StorageData } from '../domain/types'

const STORAGE_KEY = 'claritab_state'
const SCHEMA_VERSION = 1

function createDefaultState(): AppState {
  return {
    schemaVersion: SCHEMA_VERSION,
    preferences: {
      primaryMode: 'focus',
      theme: 'landscapes',
      showQuote: true,
      veilIntensity: 'medium',
      reduceMotion: false,
      showCompletedTasks: true,
      showSearchModule: true,
      showFocusModule: true,
    },
    tasks: [],
    shortcuts: [],
    backgroundCache: null,
    onboardingCompleted: false,
  }
}

function getChromeStorage(): chrome.storage.StorageArea | null {
  if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
    return null
  }
  return chrome.storage.local
}

function readFromChrome(): Promise<AppState | null> {
  const storage = getChromeStorage()
  if (!storage) return Promise.resolve(null)
  return new Promise<AppState | null>((resolve, reject) => {
    storage.get([STORAGE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      const data = result[STORAGE_KEY] as StorageData | undefined
      if (data && data.schemaVersion === SCHEMA_VERSION) {
        resolve(mergeWithDefaults(data as AppState))
      } else {
        resolve(null)
      }
    })
  })
}

function writeToChrome(state: AppState): Promise<void> {
  const storage = getChromeStorage()
  if (!storage) return Promise.resolve()
  return new Promise<void>((resolve, reject) => {
    storage.set({ [STORAGE_KEY]: state }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve()
    })
  })
}

function readFromLocalStorage(): Promise<AppState | null> {
  if (typeof localStorage === 'undefined') return Promise.resolve(null)
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return Promise.resolve(null)
    const data = JSON.parse(raw) as StorageData
    if (data && data.schemaVersion === SCHEMA_VERSION) {
      return Promise.resolve(mergeWithDefaults(data as AppState))
    }
    return Promise.resolve(null)
  } catch {
    return Promise.resolve(null)
  }
}

function writeToLocalStorage(state: AppState): Promise<void> {
  if (typeof localStorage === 'undefined') return Promise.resolve()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return Promise.resolve()
  } catch {
    return Promise.reject(new Error('localStorage write failed'))
  }
}

function mergeWithDefaults(stored: AppState): AppState {
  const defaults = createDefaultState()
  const mergedPreferences = { ...defaults.preferences, ...stored.preferences }
  return {
    ...defaults,
    ...stored,
    preferences: mergedPreferences,
    tasks: stored.tasks ?? defaults.tasks,
    shortcuts: stored.shortcuts ?? defaults.shortcuts,
    backgroundCache: stored.backgroundCache ?? defaults.backgroundCache,
    onboardingCompleted: stored.onboardingCompleted ?? defaults.onboardingCompleted,
  }
}

let memoryFallback: AppState | null = null

function readFromMemory(): Promise<AppState | null> {
  if (memoryFallback) return Promise.resolve(memoryFallback)
  return Promise.resolve(null)
}

function writeToMemory(state: AppState): Promise<void> {
  memoryFallback = state
  return Promise.resolve()
}

export async function loadState(): Promise<AppState> {
  try {
    const fromChrome = await readFromChrome()
    if (fromChrome) return fromChrome
  } catch {
    // continue to next fallback
  }
  try {
    const fromLocal = await readFromLocalStorage()
    if (fromLocal) return fromLocal
  } catch {
    // continue to next fallback
  }
  const fromMemory = await readFromMemory()
  if (fromMemory) return fromMemory
  return createDefaultState()
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await writeToChrome(state)
  } catch {
    try {
      await writeToLocalStorage(state)
    } catch {
      await writeToMemory(state)
    }
  }
}

export { createDefaultState, mergeWithDefaults }