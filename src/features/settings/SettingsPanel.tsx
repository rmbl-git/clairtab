import { useState } from 'react'
import type { Preferences, ThemeId } from '../../domain/types'

interface Props {
  preferences: Preferences
  onChange: (Prefs: Partial<Preferences>) => void
  onReset: () => void
  onClose: () => void
}

export function SettingsPanel({ preferences, onChange, onReset, onClose }: Props) {
  const [error, setError] = useState<string | null>(null)

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

  const effectiveReduceMotion = preferences.reduceMotion === true

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
        <legend>Thème</legend>
        <select
          value={preferences.theme}
          onChange={(e) => onChange({ theme: e.target.value as ThemeId })}
          aria-label="Thème du fond"
        >
          <option value="landscapes">Landscapes</option>
          <option value="architecture">Architecture</option>
          <option value="minimal">Minimal</option>
          <option value="nature">Nature</option>
        </select>
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
        <legend>Animations</legend>
        <label>
          <input
            type="checkbox"
            checked={effectiveReduceMotion}
            onChange={(e) => onChange({ reduceMotion: e.target.checked })}
          />
          Réduire les mouvements
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