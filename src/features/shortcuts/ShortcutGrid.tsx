import { useState, useEffect, useCallback, useRef } from 'react'
import type { Shortcut } from '../../domain/types'
import { validateShortcutLabel, isDangerousUrl, normalizeUrl, getFaviconUrl, isLocalhost } from '../../domain/validators'

interface Props {
  shortcuts: Shortcut[]
  onAdd: (label: string, url: string) => string | null
  onDelete: (id: string) => void
  onUpdate: (id: string, label: string, url: string) => string | null
}

interface FaviconState {
  loaded: boolean
  error: boolean
}

export function ShortcutGrid({ shortcuts, onAdd, onDelete, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [favicons, setFavicons] = useState<Record<string, FaviconState>>({})
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const getFaviconState = useCallback((s: Shortcut): FaviconState => {
    return favicons[s.id] || { loaded: false, error: false }
  }, [favicons])

  const handleFaviconLoad = useCallback((id: string) => {
    setFavicons((prev) => ({
      ...prev,
      [id]: { loaded: true, error: false },
    }))
  }, [])

  const handleFaviconError = useCallback((id: string) => {
    setFavicons((prev) => ({
      ...prev,
      [id]: { loaded: true, error: true },
    }))
  }, [])

  useEffect(() => {
    shortcuts.forEach((s) => {
      const current = favicons[s.id]
      if (!current || (!current.loaded && !current.error)) {
        const faviconUrl = getFaviconUrl(s.url)
        if (!faviconUrl || isLocalhost(new URL(s.url).hostname)) {
          setFavicons((prev) => ({
            ...prev,
            [s.id]: { loaded: true, error: true },
          }))
        }
      }
    })
  }, [shortcuts, favicons])

  const openAdd = useCallback(() => {
    setEditId(null)
    setLabel('')
    setUrl('')
    setError(null)
    setConfirmDelete(false)
    previousFocusRef.current = document.activeElement as HTMLElement | null
    setShowModal(true)
  }, [])

  const openEdit = useCallback((s: Shortcut) => {
    setEditId(s.id)
    setLabel(s.label)
    setUrl(s.url)
    setError(null)
    setConfirmDelete(false)
    const link = document.querySelector<HTMLAnchorElement>(`.claritab-shortcut-tile[data-shortcut-id="${s.id}"]`)
    previousFocusRef.current = link || document.activeElement as HTMLElement | null
    setShowModal(true)
  }, [])

  const close = useCallback(() => {
    setShowModal(false)
    setEditId(null)
    setLabel('')
    setUrl('')
    setError(null)
    setConfirmDelete(false)
    if (previousFocusRef.current) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [])

  const handleModalDelete = useCallback(() => {
    if (!editId) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete(editId)
    close()
  }, [editId, confirmDelete, onDelete, close])

  useEffect(() => {
    if (!showModal) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showModal, close])

  useEffect(() => {
    if (!showModal || !modalRef.current) return
    const modal = modalRef.current
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length > 0) {
      focusable[0].focus()
    }
  }, [showModal])

  const handleSave = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmedLabel = label.trim()
      const trimmedUrl = url.trim()
      if (!trimmedLabel || !trimmedUrl) {
        setError('Le libellé et l\'URL sont requis.')
        return
      }
      if (isDangerousUrl(trimmedUrl)) {
        setError('Protocole dangereux interdit.')
        return
      }
      let normalized: string
      try {
        normalized = normalizeUrl(trimmedUrl)
      } catch {
        setError('URL invalide.')
        return
      }
      const labelErr = validateShortcutLabel(trimmedLabel)
      if (labelErr) {
        setError(labelErr)
        return
      }
      if (editId) {
        const err = onUpdate(editId, trimmedLabel, normalized)
        if (err) {
          setError(err)
          return
        }
      } else {
        const err = onAdd(trimmedLabel, normalized)
        if (err) {
          setError(err)
          return
        }
      }
      close()
    },
    [editId, label, url, onAdd, onUpdate, close]
  )

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        close()
      }
    },
    [close]
  )

  const isSaveDisabled = !label.trim() || !url.trim() || isDangerousUrl(url.trim())

  return (
    <>
      <div className="claritab-shortcut-grid">
        {shortcuts.map((s) => {
          const faviconState = getFaviconState(s)
          const showFavicon = !faviconState.error && getFaviconUrl(s.url)
          return (
            <div className="claritab-shortcut-tile-wrapper" key={s.id}>
              <div className="claritab-shortcut-icon-area">
                <a
                  href={s.url}
                  className="claritab-shortcut-tile"
                  data-shortcut-id={s.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                >
                  {showFavicon ? (
                    <img
                      className="claritab-shortcut-icon-img"
                      src={showFavicon}
                      alt=""
                      aria-hidden="true"
                      onLoad={() => handleFaviconLoad(s.id)}
                      onError={() => handleFaviconError(s.id)}
                    />
                  ) : (
                    <span className="claritab-shortcut-icon-fallback" aria-hidden="true">
                      {s.label.charAt(0).toUpperCase()}
                    </span>
                  )}
                </a>
                <button
                  type="button"
                  className="claritab-shortcut-edit"
                  onClick={() => openEdit(s)}
                  aria-label="Modifier le raccourci"
                >
                  <span className="claritab-shortcut-edit-icon" aria-hidden="true">✎</span>
                </button>
              </div>
              <span className="claritab-shortcut-label" title={s.label}>
                {s.label}
              </span>
            </div>
          )
        })}
        <div className="claritab-shortcut-tile-wrapper claritab-shortcut-add-wrapper">
          <div className="claritab-shortcut-icon-area">
            <button
              type="button"
              className="claritab-shortcut-add"
              onClick={openAdd}
              aria-label="Ajouter un raccourci"
            >
              <span className="claritab-shortcut-add-icon" aria-hidden="true">+</span>
            </button>
          </div>
          <span className="claritab-shortcut-add-label">Ajouter</span>
        </div>
      </div>

      {showModal && (
        <>
          <div className="claritab-modal-backdrop" onClick={close} aria-hidden="true" />
          <div
            className="claritab-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={editId ? 'Modifier le raccourci' : 'Ajouter un raccourci'}
            onClick={handleOverlayClick}
          >
            <div className="claritab-modal" ref={modalRef}>
              <button
                type="button"
                className="claritab-modal-close"
                onClick={close}
                aria-label="Fermer"
              >
                ×
              </button>
              <h3 className="claritab-modal-title">
                {editId ? 'Modifier le raccourci' : 'Ajouter un raccourci'}
              </h3>
              <form onSubmit={handleSave}>
                <div className="claritab-modal-field">
                  <label htmlFor="shortcut-label">Nom</label>
                  <input
                    id="shortcut-label"
                    type="text"
                    value={label}
                    onChange={(e) => {
                      setLabel(e.target.value)
                      if (error) setError(null)
                    }}
                    onInput={() => {
                      if (error) setError(null)
                    }}
                    placeholder="Nom du raccourci"
                    maxLength={32}
                    aria-describedby={error ? 'shortcut-modal-error' : undefined}
                    aria-invalid={!!error}
                  />
                </div>
                <div className="claritab-modal-field">
                  <label htmlFor="shortcut-url">URL</label>
                  <input
                    id="shortcut-url"
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      if (error) setError(null)
                    }}
                    onInput={() => {
                      if (error) setError(null)
                    }}
                    placeholder="https://exemple.com"
                    aria-describedby={error ? 'shortcut-modal-error' : undefined}
                    aria-invalid={!!error}
                  />
                </div>
                {error && (
                  <p id="shortcut-modal-error" className="claritab-modal-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="claritab-modal-actions">
                  {editId && (
                    <button
                      type="button"
                      className={`claritab-modal-delete ${confirmDelete ? 'claritab-modal-delete-confirm' : ''}`}
                      onClick={handleModalDelete}
                    >
                      {confirmDelete ? 'Confirmer la suppression' : 'Supprimer cet élément'}
                    </button>
                  )}
                  <button type="button" className="claritab-modal-cancel" onClick={close}>
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="claritab-modal-save"
                    disabled={isSaveDisabled}
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
