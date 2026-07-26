import { useState, useRef, useEffect } from 'react'
import type { Preferences } from '../../domain/types'
import { processImageFile } from '../background/custom-background'

interface Props {
  preferences: Preferences
  onChange: (Prefs: Partial<Preferences>) => void
  onReset: () => void
  onClose: () => void
  onChooseCustomBackground?: (dataUrl: string) => void | Promise<void>
}

export function SettingsPanel({ preferences, onChange, onReset, onClose, onChooseCustomBackground }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [customError, setCustomError] = useState<string | null>(null)
  const [customSuccess, setCustomSuccess] = useState<string | null>(null)
  const [customLoading, setCustomLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const successTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current)
      }
    }
  }, [])

  const showCustomSuccess = (message: string) => {
    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current)
    }
    setCustomSuccess(message)
    setCustomError(null)
    successTimerRef.current = window.setTimeout(() => {
      setCustomSuccess(null)
    }, 2000)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCustomLoading(true)
    setCustomError(null)
    setCustomSuccess(null)

    try {
      const dataUrl = await processImageFile(file)
      await onChooseCustomBackground?.(dataUrl)
      showCustomSuccess('Background updated.')
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : 'An error occurred while processing the image.')
    } finally {
      setCustomLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDisableBothModules = () => {
    setError("At least one module must remain enabled.")
  }

  const handleSearchToggle = (checked: boolean) => {
    if (!checked && !preferences.showFocusModule) {
      handleDisableBothModules()
      return
    }
    setError(null)
    onChange({ showSearchModule: checked })
  }

  const handleFocusToggle = (checked: boolean) => {
    if (!checked && !preferences.showSearchModule) {
      handleDisableBothModules()
      return
    }
    setError(null)
    onChange({ showFocusModule: checked })
  }

  return (
    <div className="claritab-settings" role="dialog" aria-label="Settings">
      <h2 className="claritab-settings-title">Settings</h2>
      <button
        type="button"
        className="claritab-settings-close"
        onClick={onClose}
        aria-label="Close settings"
      >
        ×
      </button>

      {error && (
        <p className="claritab-settings-error" role="alert">
          {error}
        </p>
      )}

      <fieldset className="claritab-settings-group">
        <legend>Visible modules</legend>
        <label>
          <input
            type="checkbox"
            checked={preferences.showSearchModule}
            onChange={(e) => handleSearchToggle(e.target.checked)}
          />
          Show Search
        </label>
        <label>
          <input
            type="checkbox"
            checked={preferences.showFocusModule}
            onChange={(e) => handleFocusToggle(e.target.checked)}
          />
          Show Tasks
        </label>
      </fieldset>

      <div className="claritab-settings-divider" aria-hidden="true" />
      <fieldset className="claritab-settings-group">
        <legend>Default mode</legend>
        <label>
          <input
            type="radio"
            name="primaryMode"
            checked={preferences.primaryMode === 'focus'}
            onChange={() => onChange({ primaryMode: 'focus' })}
          />
          Tasks
        </label>
        <label>
          <input
            type="radio"
            name="primaryMode"
            checked={preferences.primaryMode === 'search'}
            onChange={() => onChange({ primaryMode: 'search' })}
          />
          Search
        </label>
      </fieldset>

      <div className="claritab-settings-divider" aria-hidden="true" />
      <fieldset className="claritab-settings-group">
        <legend>Background overlay</legend>
        <label>
          <input
            type="radio"
            name="veilIntensity"
            checked={preferences.veilIntensity === 'light'}
            onChange={() => onChange({ veilIntensity: 'light' })}
          />
          Light
        </label>
        <label>
          <input
            type="radio"
            name="veilIntensity"
            checked={preferences.veilIntensity === 'medium'}
            onChange={() => onChange({ veilIntensity: 'medium' })}
          />
          Medium
        </label>
        <label>
          <input
            type="radio"
            name="veilIntensity"
            checked={preferences.veilIntensity === 'strong'}
            onChange={() => onChange({ veilIntensity: 'strong' })}
          />
          Strong
        </label>
      </fieldset>

      <div className="claritab-settings-divider" aria-hidden="true" />
      <fieldset className="claritab-settings-group">
        <legend>Quote</legend>
        <label>
          <input
            type="checkbox"
            checked={preferences.showQuote}
            onChange={(e) => onChange({ showQuote: e.target.checked })}
          />
          Show
        </label>
      </fieldset>

      <div className="claritab-settings-divider" aria-hidden="true" />
      <fieldset className="claritab-settings-group">
        <legend>Tasks</legend>
        <label>
          <input
            type="checkbox"
            checked={preferences.showCompletedTasks}
            onChange={(e) => onChange({ showCompletedTasks: e.target.checked })}
          />
          Show completed tasks
        </label>
      </fieldset>

      <div className="claritab-settings-divider" aria-hidden="true" />
      <fieldset className="claritab-settings-group">
        <legend>Custom background</legend>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
          tabIndex={-1}
        />
        <button
          type="button"
          className="claritab-settings-refresh"
          onClick={() => fileInputRef.current?.click()}
          disabled={customLoading}
        >
          {customLoading ? 'Loading...' : 'Choose a photo'}
        </button>
        <span className="claritab-settings-size-hint">Max. 8 MB</span>
        {(customError) && (
          <p className="claritab-settings-background-error" role="alert">
            {customError}
          </p>
        )}
        {customSuccess && (
          <p className="claritab-settings-success" role="status">
            {customSuccess}
          </p>
        )}
      </fieldset>

      <div className="claritab-settings-actions">
        <button type="button" className="claritab-settings-reset" onClick={onReset}>
          Reset data
        </button>
      </div>

      <p className="claritab-settings-note">
        Your data stays on this device. No information is sent to a server.
      </p>
    </div>
  )
}
