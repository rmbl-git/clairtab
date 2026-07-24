import { useState, useEffect, useCallback } from 'react'
import { loadState, saveState, createDefaultState } from '../storage/storage'
import { brand } from '../config/brand'
import type { AppState, Preferences, Task, Shortcut } from '../domain/types'
import {
  validateTaskTitle,
  validateShortcutLabel,
  normalizeUrl,
  isDangerousUrl,
  buildGoogleSearchUrl,
  generateId,
} from '../domain/validators'
import { SettingsPanel } from '../features/settings/SettingsPanel'
import { SearchPanel } from '../features/search/SearchPanel'
import { TaskPanel } from '../features/tasks/TaskPanel'
import { ShortcutGrid } from '../features/shortcuts/ShortcutGrid'
import { AmbientHeader } from '../features/ambient/AmbientHeader'
import { ModeSwitcher } from '../features/modeswitcher/ModeSwitcher'
import { useBackground } from '../features/background/use-background'
import '../styles/shell.css'

export default function App() {
  const [state, setState] = useState<AppState | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    loadState().then((s) => {
      setState(s)
      setLoaded(true)
    })
  }, [])

  const updatePreferences = useCallback((Prefs: Partial<Preferences>) => {
    setState((prev: AppState | null) => {
      if (!prev) return prev
      const next: AppState = {
        ...prev,
        preferences: { ...prev.preferences, ...Prefs },
      }
      saveState(next)
      return next
    })
  }, [])

  const switchMode = useCallback(
    (mode: 'focus' | 'search') => {
      updatePreferences({ primaryMode: mode })
    },
    [updatePreferences]
  )

  const addTask = useCallback((title: string) => {
    const error = validateTaskTitle(title)
    if (error) return error
    setState((prev: AppState | null) => {
      if (!prev) return prev
      const task: Task = {
        id: generateId(),
        title: title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
      }
      const next: AppState = { ...prev, tasks: [task, ...prev.tasks] }
      saveState(next)
      return next
    })
    return null
  }, [])

  const toggleTask = useCallback((id: string) => {
    setState((prev: AppState | null) => {
      if (!prev) return prev
      const next: AppState = {
        ...prev,
        tasks: prev.tasks.map((t: Task) =>
          t.id === id
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed ? new Date().toISOString() : null,
              }
            : t
        ),
      }
      saveState(next)
      return next
    })
  }, [])

  const deleteTask = useCallback((id: string) => {
    setState((prev: AppState | null) => {
      if (!prev) return prev
      const next: AppState = { ...prev, tasks: prev.tasks.filter((t: Task) => t.id !== id) }
      saveState(next)
      return next
    })
  }, [])

  const clearCompleted = useCallback(() => {
    setState((prev: AppState | null) => {
      if (!prev) return prev
      const next: AppState = { ...prev, tasks: prev.tasks.filter((t: Task) => !t.completed) }
      saveState(next)
      return next
    })
  }, [])

  const addShortcut = useCallback((label: string, urlCandidate: string) => {
    const labelError = validateShortcutLabel(label)
    if (labelError) return labelError
    if (isDangerousUrl(urlCandidate)) {
      return 'Dangerous URL protocol is not allowed.'
    }
    let normalized: string
    try {
      normalized = normalizeUrl(urlCandidate)
    } catch {
      return 'Please enter a valid URL.'
    }
    setState((prev: AppState | null) => {
      if (!prev) return prev
      if (prev.shortcuts.length >= 12) return prev
      const shortcut: Shortcut = {
        id: generateId(),
        label: label.trim(),
        url: normalized,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const next: AppState = { ...prev, shortcuts: [...prev.shortcuts, shortcut] }
      saveState(next)
      return next
    })
    return null
  }, [])

  const deleteShortcut = useCallback((id: string) => {
    setState((prev: AppState | null) => {
      if (!prev) return prev
      const next: AppState = { ...prev, shortcuts: prev.shortcuts.filter((s: Shortcut) => s.id !== id) }
      saveState(next)
      return next
    })
  }, [])

  const updateShortcut = useCallback((id: string, label: string, urlCandidate: string) => {
    const labelError = validateShortcutLabel(label)
    if (labelError) return labelError
    if (isDangerousUrl(urlCandidate)) {
      return 'Dangerous URL protocol is not allowed.'
    }
    let normalized: string
    try {
      normalized = normalizeUrl(urlCandidate)
    } catch {
      return 'Please enter a valid URL.'
    }
    setState((prev: AppState | null) => {
      if (!prev) return prev
      const next: AppState = {
        ...prev,
        shortcuts: prev.shortcuts.map((s: Shortcut) =>
          s.id === id
            ? { ...s, label: label.trim(), url: normalized, updatedAt: new Date().toISOString() }
            : s
        ),
      }
      saveState(next)
      return next
    })
    return null
  }, [])

  const resetData = useCallback(() => {
    setState(createDefaultState())
    saveState(createDefaultState())
  }, [])

  const handleSearchSubmit = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return 'Search query cannot be empty.'
    const url = buildGoogleSearchUrl(trimmed)
    window.location.href = url
    return null
  }, [])

  if (!loaded || !state) {
    return (
      <div className="claritab-shell">
        <div className="claritab-background" aria-hidden="true" />
        <main className="claritab-main">
          <div className="claritab-content">
            <div className="claritab-container">
              <div className="text-gray-400 text-sm">Chargement.</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const { preferences, tasks, shortcuts } = state
  const bg = useBackground(preferences)
  const bgImageUrl = bg.cache?.imageUrl ?? ''
  const bgColor = bg.cache?.color ?? '#1a2a3a'
  const bgOverlay =
    preferences.veilIntensity === 'light'
      ? bgColor + '66'
      : preferences.veilIntensity === 'strong'
        ? bgColor + 'CC'
        : bgColor + '99'
  const { showSearchModule, showFocusModule } = preferences
  const activeModule = preferences.primaryMode

  const renderModule = () => {
    if (showSearchModule && showFocusModule) {
      return (
        <>
          <ModeSwitcher activeMode={activeModule} onSwitch={switchMode} />
          {activeModule === 'search' ? (
            <SearchPanel onSubmit={handleSearchSubmit} />
          ) : (
            <TaskPanel
              tasks={tasks}
              onAdd={addTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onClearCompleted={clearCompleted}
              showCompleted={preferences.showCompletedTasks}
            />
          )}
        </>
      )
    }
    if (showSearchModule) {
      return <SearchPanel onSubmit={handleSearchSubmit} />
    }
    if (showFocusModule) {
      return (
        <TaskPanel
          tasks={tasks}
          onAdd={addTask}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onClearCompleted={clearCompleted}
          showCompleted={preferences.showCompletedTasks}
        />
      )
    }
    return <p className="claritab-empty">Aucun module affich&eacute;.</p>
  }

  return (
    <div
      className={`claritab-shell${preferences.reduceMotion === true ? ' claritab-reduced-motion' : ''}`}
      style={{ '--bg-image': `url(${bgImageUrl})`, '--bg-color': bgColor, '--bg-overlay': bgOverlay } as React.CSSProperties}
    >
      <div className="claritab-background" aria-hidden="true" />
      <main className="claritab-main">
        <button
          className="claritab-settings-toggle"
          onClick={() => setSettingsOpen(!settingsOpen)}
          aria-label="Ouvrir les r&eacute;glages"
          type="button"
        >
          &#9881;
        </button>
        {settingsOpen && (
          <SettingsPanel
            preferences={preferences}
            onChange={updatePreferences}
            onReset={resetData}
            onClose={() => setSettingsOpen(false)}
            backgroundLoading={bg.loading}
            backgroundError={bg.error}
            onRefreshBackground={() => bg.refresh(true)}
            attribution={bg.attribution}
          />
        )}
        <div className="claritab-content">
          {preferences.showQuote && <AmbientHeader />}
          <div className="claritab-container">
            {renderModule()}
            <ShortcutGrid
              shortcuts={shortcuts}
              onAdd={addShortcut}
              onDelete={deleteShortcut}
              onUpdate={updateShortcut}
            />
          </div>
        </div>
        <footer className="claritab-footer">
          <p>{brand.name}</p>
          {bg.attribution && (
            <p className="claritab-attribution">
              Photo par{' '}
              <a href={bg.attribution.photographerUrl} target="_blank" rel="noopener noreferrer">
                {bg.attribution.photographer}
              </a>{' '}
              sur{' '}
              <a href={bg.attribution.providerUrl} target="_blank" rel="noopener noreferrer">
                {bg.attribution.provider}
              </a>
            </p>
          )}
        </footer>
      </main>
    </div>
  )
}
