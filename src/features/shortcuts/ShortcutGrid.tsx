import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Shortcut } from '../../domain/types'
import { validateShortcutLabel, isDangerousUrl, normalizeUrl, getFaviconUrl, isLocalhost } from '../../domain/validators'

export interface ShortcutGridHandle {
  activateDragForTest: (id: string) => void
  deactivateDragForTest: () => void
}

interface Props {
  shortcuts: Shortcut[]
  onAdd: (label: string, url: string) => string | null
  onDelete: (id: string) => void
  onUpdate: (id: string, label: string, url: string) => string | null
  onReorder?: (shortcuts: Shortcut[]) => void
}

const LONG_PRESS_DELAY_MS = 800

interface FaviconState {
  loaded: boolean
  error: boolean
}

function SortableShortcut({ shortcut, onEdit, favicons, handleFaviconLoad, handleFaviconError, suppressNavigationRef, draggedIdRef }: { shortcut: Shortcut; onEdit: (id: string) => void; favicons: Record<string, FaviconState>; handleFaviconLoad: (id: string) => void; handleFaviconError: (id: string) => void; suppressNavigationRef: React.RefObject<boolean>; draggedIdRef: React.RefObject<string | null> }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: shortcut.id })
  
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : undefined,
  }

  const faviconState = favicons[shortcut.id] || { loaded: false, error: false }
  const showFavicon = !faviconState.error && getFaviconUrl(shortcut.url)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="claritab-shortcut-tile-wrapper"
      {...attributes}
      {...listeners}
    >
      <div className="claritab-shortcut-icon-area">
        <a
          href={shortcut.url}
          className="claritab-shortcut-tile"
          data-shortcut-id={shortcut.id}
          title={shortcut.label}
          onClick={(e) => {
            if (suppressNavigationRef.current && draggedIdRef.current === shortcut.id) {
              e.preventDefault()
            }
          }}
        >
          {showFavicon ? (
            <img
              className="claritab-shortcut-icon-img"
              src={showFavicon}
              alt=""
              aria-hidden="true"
              onLoad={() => handleFaviconLoad(shortcut.id)}
              onError={() => handleFaviconError(shortcut.id)}
            />
          ) : (
            <span className="claritab-shortcut-icon-fallback" aria-hidden="true">
              {shortcut.label.charAt(0).toUpperCase()}
            </span>
          )}
        </a>
        <button
          type="button"
          className="claritab-shortcut-edit"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(shortcut.id)
          }}
          aria-label={`Modifier le raccourci ${shortcut.label}`}
        >
          <span className="claritab-shortcut-edit-icon" aria-hidden="true">✎</span>
        </button>
      </div>
      <span className="claritab-shortcut-label" title={shortcut.label}>
        {shortcut.label}
      </span>
    </div>
  )
}

export const ShortcutGrid = forwardRef<ShortcutGridHandle, Props>(({ shortcuts, onAdd, onDelete, onUpdate, onReorder }, ref) => {
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [favicons, setFavicons] = useState<Record<string, FaviconState>>({})
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const dragActivatedRef = useRef(false)
  const suppressShortcutNavigationRef = useRef(false)
  const draggedShortcutIdRef = useRef<string | null>(null)
  const suppressionCleanupTimerRef = useRef<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: LONG_PRESS_DELAY_MS, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const clearSuppression = useCallback(() => {
    suppressShortcutNavigationRef.current = false
    draggedShortcutIdRef.current = null
  }, [])

  const scheduleClearSuppression = useCallback(() => {
    if (suppressionCleanupTimerRef.current) {
      clearTimeout(suppressionCleanupTimerRef.current)
    }
    suppressionCleanupTimerRef.current = window.setTimeout(() => {
      clearSuppression()
      suppressionCleanupTimerRef.current = null
    }, 0)
  }, [clearSuppression])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    dragActivatedRef.current = true
    suppressShortcutNavigationRef.current = true
    draggedShortcutIdRef.current = String(event.active.id)
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id !== over.id || !onReorder) {
      scheduleClearSuppression()
      return
    }

    const oldIndex = shortcuts.findIndex((s) => s.id === active.id)
    const newIndex = shortcuts.findIndex((s) => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) {
      scheduleClearSuppression()
      return
    }

    suppressShortcutNavigationRef.current = true
    onReorder(arrayMove(shortcuts, oldIndex, newIndex))
    scheduleClearSuppression()
  }, [shortcuts, onReorder, scheduleClearSuppression])

  const handleDragCancel = useCallback(() => {
    scheduleClearSuppression()
  }, [scheduleClearSuppression])

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

  const openEdit = useCallback((id: string) => {
    const shortcut = shortcuts.find((s) => s.id === id)
    if (!shortcut) return
    setEditId(id)
    setLabel(shortcut.label)
    setUrl(shortcut.url)
    setError(null)
    setConfirmDelete(false)
    const link = document.querySelector<HTMLAnchorElement>(`.claritab-shortcut-tile[data-shortcut-id="${id}"]`)
    previousFocusRef.current = link || document.activeElement as HTMLElement | null
    setShowModal(true)
  }, [shortcuts])

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

  useImperativeHandle(ref, () => ({
    activateDragForTest: (id: string) => {
      suppressShortcutNavigationRef.current = true
      draggedShortcutIdRef.current = id
    },
    deactivateDragForTest: () => {
      suppressShortcutNavigationRef.current = false
      draggedShortcutIdRef.current = null
    },
  }), [])

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
        <SortableContext items={shortcuts.map((s) => s.id)} strategy={rectSortingStrategy}>
          <div className="claritab-shortcut-grid">
            {shortcuts.map((s) => (
              <SortableShortcut
                key={s.id}
                shortcut={s}
                onEdit={openEdit}
                favicons={favicons}
                handleFaviconLoad={handleFaviconLoad}
                handleFaviconError={handleFaviconError}
                suppressNavigationRef={suppressShortcutNavigationRef}
                draggedIdRef={draggedShortcutIdRef}
              />
            ))}
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
        </SortableContext>
      </DndContext>

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
})
