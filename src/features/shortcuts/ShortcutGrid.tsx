import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent, closestCenter } from '@dnd-kit/core'
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

interface SortableShortcutProps {
  shortcut: Shortcut
  onEdit: (id: string) => void
  favicons: Record<string, FaviconState>
  handleFaviconLoad: (id: string) => void
  handleFaviconError: (id: string) => void
  onActivate: (
    url: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void
}

function SortableShortcut({
  shortcut,
  onEdit,
  favicons,
  handleFaviconLoad,
  handleFaviconError,
  onActivate,
}: SortableShortcutProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: shortcut.id,
  })

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
        <button
          type="button"
          className="claritab-shortcut-tile"
          data-shortcut-id={shortcut.id}
          title={shortcut.label}
          aria-label={shortcut.label}
          draggable={false}
          onClick={(event) => onActivate(shortcut.url, event)}
          onDragStart={(event) => event.preventDefault()}
          style={{ padding: 0, cursor: 'pointer', font: 'inherit' }}
        >
          {showFavicon ? (
            <img
              className="claritab-shortcut-icon-img"
              src={showFavicon}
              alt=""
              aria-hidden="true"
              draggable={false}
              onLoad={() => handleFaviconLoad(shortcut.id)}
              onError={() => handleFaviconError(shortcut.id)}
            />
          ) : (
            <span className="claritab-shortcut-icon-fallback" aria-hidden="true">
              {shortcut.label.charAt(0).toUpperCase()}
            </span>
          )}
        </button>
        <button
          type="button"
          className="claritab-shortcut-edit"
          onClick={(event) => {
            event.stopPropagation()
            onEdit(shortcut.id)
          }}
          aria-label={`Edit shortcut ${shortcut.label}`}
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

export const ShortcutGrid = forwardRef<ShortcutGridHandle, Props>(
  ({ shortcuts, onAdd, onDelete, onUpdate, onReorder }, ref) => {
    const [showModal, setShowModal] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [label, setLabel] = useState('')
    const [url, setUrl] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [favicons, setFavicons] = useState<Record<string, FaviconState>>({})

    const modalRef = useRef<HTMLDivElement>(null)
    const previousFocusRef = useRef<HTMLElement | null>(null)
    const isDraggingRef = useRef(false)
    const suppressShortcutNavigationRef = useRef(false)

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          delay: LONG_PRESS_DELAY_MS,
          tolerance: 5,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    )

    const clearSuppression = useCallback(() => {
      suppressShortcutNavigationRef.current = false
    }, [])

    const handleShortcutActivate = useCallback(
      (
        shortcutUrl: string,
        event: React.MouseEvent<HTMLButtonElement>,
      ) => {
        /*
         * Once dragging is active, the click generated on release may be sent
         * to the moved shortcut or to the shortcut currently under the pointer.
         * Because shortcuts are no longer native links, this activation can simply
         * be consumed without navigating.
         */
        if (suppressShortcutNavigationRef.current) {
          event.preventDefault()
          event.stopPropagation()
          clearSuppression()
          return
        }

        window.location.assign(shortcutUrl)
      },
      [clearSuppression]
    )

    const handleDragStart = useCallback(() => {
      isDraggingRef.current = true
      suppressShortcutNavigationRef.current = true
    }, [])

    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        const { active, over } = event

        isDraggingRef.current = false

        if (!over || active.id === over.id || !onReorder) {
          return
        }

        const activeId = String(active.id)
        const overId = String(over.id)

        const oldIndex = shortcuts.findIndex((shortcut) => shortcut.id === activeId)
        const newIndex = shortcuts.findIndex((shortcut) => shortcut.id === overId)

        if (oldIndex === -1 || newIndex === -1) {
          return
        }

        const reorderedShortcuts = arrayMove(shortcuts, oldIndex, newIndex)
        onReorder(reorderedShortcuts)
      },
      [shortcuts, onReorder]
    )

    const handleDragCancel = useCallback(() => {
      isDraggingRef.current = false
    }, [])

    const handleFaviconLoad = useCallback((id: string) => {
      setFavicons((previous) => ({
        ...previous,
        [id]: { loaded: true, error: false },
      }))
    }, [])

    const handleFaviconError = useCallback((id: string) => {
      setFavicons((previous) => ({
        ...previous,
        [id]: { loaded: true, error: true },
      }))
    }, [])

    useEffect(() => {
      shortcuts.forEach((shortcut) => {
        const current = favicons[shortcut.id]

        if (!current || (!current.loaded && !current.error)) {
          const faviconUrl = getFaviconUrl(shortcut.url)

          if (!faviconUrl || isLocalhost(new URL(shortcut.url).hostname)) {
            setFavicons((previous) => ({
              ...previous,
              [shortcut.id]: { loaded: true, error: true },
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

    const openEdit = useCallback(
      (id: string) => {
        const shortcut = shortcuts.find((item) => item.id === id)
        if (!shortcut) return

        setEditId(id)
        setLabel(shortcut.label)
        setUrl(shortcut.url)
        setError(null)
        setConfirmDelete(false)

        const link = document.querySelector<HTMLButtonElement>(
          `.claritab-shortcut-tile[data-shortcut-id="${id}"]`
        )
        previousFocusRef.current = link || (document.activeElement as HTMLElement | null)
        setShowModal(true)
      },
      [shortcuts]
    )

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

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault()
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
      (event: React.FormEvent) => {
        event.preventDefault()

        const trimmedLabel = label.trim()
        const trimmedUrl = url.trim()

        if (!trimmedLabel || !trimmedUrl) {
          setError('The label and URL are required.')
          return
        }

        if (isDangerousUrl(trimmedUrl)) {
          setError('Dangerous URL protocols are not allowed.')
          return
        }

        let normalized: string

        try {
          normalized = normalizeUrl(trimmedUrl)
        } catch {
          setError('Invalid URL.')
          return
        }

        const labelError = validateShortcutLabel(trimmedLabel)

        if (labelError) {
          setError(labelError)
          return
        }

        if (editId) {
          const updateError = onUpdate(editId, trimmedLabel, normalized)

          if (updateError) {
            setError(updateError)
            return
          }
        } else {
          const addError = onAdd(trimmedLabel, normalized)

          if (addError) {
            setError(addError)
            return
          }
        }

        close()
      },
      [editId, label, url, onAdd, onUpdate, close]
    )

    const handleOverlayClick = useCallback(
      (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
          close()
        }
      },
      [close]
    )

    const isSaveDisabled = !label.trim() || !url.trim() || isDangerousUrl(url.trim())

    const handleGridPointerDownCapture = useCallback(() => {
      /*
       * The residual click after a drag is not preceded by a new pointerdown.
       * A new pointerdown after the drag ends therefore indicates a new
       * intentional interaction, so navigation can be enabled again before its click.
       */
      if (
        suppressShortcutNavigationRef.current &&
        !isDraggingRef.current
      ) {
        clearSuppression()
      }
    }, [clearSuppression])

    const handleGridKeyDownCapture = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (
          suppressShortcutNavigationRef.current &&
          !isDraggingRef.current &&
          (event.key === 'Enter' || event.key === ' ')
        ) {
          clearSuppression()
        }
      },
      [clearSuppression]
    )

    useImperativeHandle(
      ref,
      () => ({
        activateDragForTest: (_id: string) => {
          void _id
          isDraggingRef.current = false
          suppressShortcutNavigationRef.current = true
        },
        deactivateDragForTest: () => {
          clearSuppression()
        },
      }),
      [clearSuppression]
    )

    return (
      <>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={shortcuts.map((shortcut) => shortcut.id)}
            strategy={rectSortingStrategy}
          >
            <div
              className="claritab-shortcut-grid"
              onPointerDownCapture={handleGridPointerDownCapture}
              onKeyDownCapture={handleGridKeyDownCapture}
            >
              {shortcuts.map((shortcut) => (
                <SortableShortcut
                  key={shortcut.id}
                  shortcut={shortcut}
                  onEdit={openEdit}
                  favicons={favicons}
                  handleFaviconLoad={handleFaviconLoad}
                  handleFaviconError={handleFaviconError}
                  onActivate={handleShortcutActivate}
                />
              ))}

              <div className="claritab-shortcut-tile-wrapper claritab-shortcut-add-wrapper">
                <div className="claritab-shortcut-icon-area">
                  <button
                    type="button"
                    className="claritab-shortcut-add"
                    onClick={openAdd}
                    aria-label="Add shortcut"
                  >
                    <span className="claritab-shortcut-add-icon" aria-hidden="true">+</span>
                  </button>
                </div>
                <span className="claritab-shortcut-add-label">Add</span>
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
              aria-label={editId ? 'Edit shortcut' : 'Add shortcut'}
              onClick={handleOverlayClick}
            >
              <div className="claritab-modal" ref={modalRef}>
                <button
                  type="button"
                  className="claritab-modal-close"
                  onClick={close}
                  aria-label="Close"
                >
                  ×
                </button>

                <h3 className="claritab-modal-title">
                  {editId ? 'Edit shortcut' : 'Add shortcut'}
                </h3>

                <form onSubmit={handleSave}>
                  <div className="claritab-modal-field">
                    <label htmlFor="shortcut-label">Name</label>
                    <input
                      id="shortcut-label"
                      type="text"
                      value={label}
                      onChange={(event) => {
                        setLabel(event.target.value)
                        if (error) setError(null)
                      }}
                      onInput={() => {
                        if (error) setError(null)
                      }}
                      placeholder="Shortcut name"
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
                      onChange={(event) => {
                        setUrl(event.target.value)
                        if (error) setError(null)
                      }}
                      onInput={() => {
                        if (error) setError(null)
                      }}
                      placeholder="https://example.com"
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
                        className={`claritab-modal-delete ${
                          confirmDelete ? 'claritab-modal-delete-confirm' : ''
                        }`}
                        onClick={handleModalDelete}
                      >
                        {confirmDelete ? 'Confirm deletion' : 'Delete shortcut'}
                      </button>
                    )}

                    <button
                      type="button"
                      className="claritab-modal-cancel"
                      onClick={close}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="claritab-modal-save"
                      disabled={isSaveDisabled}
                    >
                      Save
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
)