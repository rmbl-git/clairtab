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
  localBackgroundsOnly: boolean
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

export interface BackgroundImage {
  photoId: string
  imageUrl: string
  alt: string
  color: string
  photographer: string
  photographerUrl: string
  provider: string
  providerUrl: string
}

export interface BackgroundBatch {
  theme: ThemeId
  images: BackgroundImage[]
  fetchedAt: string
  expiresAt: string
  lastDisplayedPhotoId: string | null
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
  backgroundBatch: BackgroundBatch | null
  onboardingCompleted: boolean
}

export type StorageData = AppState