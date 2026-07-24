export type ThemeId = 'landscapes' | 'architecture' | 'minimal' | 'nature'

export interface Preferences {
  primaryMode: 'focus' | 'search'
  theme: ThemeId
  showQuote: boolean
  veilIntensity: 'light' | 'medium' | 'strong'
  reduceMotion: boolean | 'system'
  showCompletedTasks: boolean
  showSearchModule: boolean
  showFocusModule: boolean
}

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  completedAt: string | null
}

export interface Shortcut {
  id: string
  label: string
  url: string
  createdAt: string
  updatedAt: string
}

export interface BackgroundCache {
  theme: ThemeId
  imageUrl: string
  color: string
  alt: string
  fetchedAt: string
  expiresAt: string
}

export interface AppState {
  schemaVersion: number
  preferences: Preferences
  tasks: Task[]
  shortcuts: Shortcut[]
  backgroundCache: BackgroundCache | null
  onboardingCompleted: boolean
}

export type StorageData = AppState