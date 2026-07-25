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
      showCustomSuccess('Fond d\'écran mis à jour.')
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : 'Erreur lors du traitement de l\'image.')
    } finally {
      setCustomLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDisableBothModules = () => {
    setError("Au moins un module doit rester activé.")
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
    <div className="claritab-settings" role="dialog" aria-label="Réglages">
      <h2 className="claritab-settings-title">Réglages</h2>
      <button
        type="button"
        className="claritab-settings-close"
        onClick={onClose}
        aria-label="Fermer les réglages"
      >
        ×
      </button>

      {error && (
        <p className="claritab-settings-error" role="alert">
          {error}
        </p>
      )}

      <fieldset className="claritab-settings-group">
        <legend>Modules affichés</legend>
        <label>
          <input
            type="checkbox"
            checked={preferences.showSearchModule}
            onChange={(e) => handleSearchToggle(e.target.checked)}
          />
          Afficher Recherche
        </label>
        <label>
          <input
            type="checkbox"
            checked={preferences.showFocusModule}
            onChange={(e) => handleFocusToggle(e.target.checked)}
          />
          Afficher To-do
        </label>
      </fieldset>

      <fieldset className="claritab-settings-group">
        <legend>Mode par défaut</legend>
        <label>
          <input
            type="radio"
            name="primaryMode"
            checked={preferences.primaryMode === 'focus'}
            onChange={() => onChange({ primaryMode: 'focus' })}
          />
          Focus
        </label>
        <label>
          <input
            type="radio"
            name="primaryMode"
            checked={preferences.primaryMode === 'search'}
            onChange={() => onChange({ primaryMode: 'search' })}
          />
          Recherche
        </label>
      </fieldset>

      <fieldset className="claritab-settings-group">
        <legend>Voile</legend>
        <label>
          <input
            type="radio"
            name="veilIntensity"
            checked={preferences.veilIntensity === 'light'}
            onChange={() => onChange({ veilIntensity: 'light' })}
          />
          Léger
        </label>
        <label>
          <input
            type="radio"
            name="veilIntensity"
            checked={preferences.veilIntensity === 'medium'}
            onChange={() => onChange({ veilIntensity: 'medium' })}
          />
          Moyen
        </label>
        <label>
          <input
            type="radio"
            name="veilIntensity"
            checked={preferences.veilIntensity === 'strong'}
            onChange={() => onChange({ veilIntensity: 'strong' })}
          />
          Fort
        </label>
      </fieldset>

      <fieldset className="claritab-settings-group">
        <legend>Citation</legend>
        <label>
          <input
            type="checkbox"
            checked={preferences.showQuote}
            onChange={(e) => onChange({ showQuote: e.target.checked })}
          />
          Afficher
        </label>
      </fieldset>

      <fieldset className="claritab-settings-group">
        <legend>Tâches</legend>
        <label>
          <input
            type="checkbox"
            checked={preferences.showCompletedTasks}
            onChange={(e) => onChange({ showCompletedTasks: e.target.checked })}
          />
          Afficher les tâches terminées
        </label>
      </fieldset>

      <fieldset className="claritab-settings-group">
        <legend>Fond d'écran personnalisé</legend>
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
          {customLoading ? 'Chargement...' : 'Choisir une photo'}
        </button>
        <span className="claritab-settings-size-hint">Max. 8 Mo</span>
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
          Réinitialiser les données
        </button>
      </div>

      <p className="claritab-settings-note">
        Les données restent sur l\'appareil. Aucune information n\'est envoyée à un serveur.
      </p>
    </div>
  )
}
