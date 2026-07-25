import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShortcutGrid, ShortcutGridHandle } from '../features/shortcuts/ShortcutGrid'
import type { Shortcut } from '../domain/types'

vi.mock('../domain/validators', async () => {
  const actual = await vi.importActual('../domain/validators')
  return {
    ...actual,
    getFaviconUrl: vi.fn(() => null),
  }
})

const mockShortcuts: Shortcut[] = [
  {
    id: '1',
    label: 'GitHub',
    url: 'https://github.com',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
]

describe('ShortcutGrid', () => {
  it('renders shortcuts with monogram fallback when favicon is unavailable', () => {
    render(
      <ShortcutGrid
        shortcuts={mockShortcuts}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    )
    expect(screen.getByText('G')).toBeDefined()
    expect(screen.getByText('GitHub')).toBeDefined()
  })

  it('does not render a delete button on the tile', () => {
    render(
      <ShortcutGrid
        shortcuts={mockShortcuts}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    )
    expect(screen.queryByLabelText('Supprimer GitHub')).toBeNull()
  })

  it('opens add modal when clicking add button', () => {
    render(
      <ShortcutGrid
        shortcuts={[]}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    )
    fireEvent.click(screen.getByLabelText('Ajouter un raccourci'))
    expect(screen.getByLabelText('Ajouter un raccourci', { selector: '[aria-modal="true"]' })).toBeDefined()
    expect(screen.getByLabelText('Fermer')).toBeDefined()
  })

  it('closes modal without saving on Escape', () => {
    render(
      <ShortcutGrid
        shortcuts={[]}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    )
    fireEvent.click(screen.getByLabelText('Ajouter un raccourci'))
    expect(screen.getByLabelText('Fermer')).toBeDefined()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByLabelText('Fermer')).toBeNull()
  })

  it('opens edit modal with pre-filled fields', () => {
    render(
      <ShortcutGrid
        shortcuts={mockShortcuts}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le raccourci GitHub' }))
    expect(screen.getByRole('dialog', { name: 'Modifier le raccourci' })).toBeDefined()
    expect(screen.getByLabelText('Nom').closest('input')).toHaveValue('GitHub')
    expect(screen.getByLabelText('URL').closest('input')).toHaveValue('https://github.com')
  })

  it('restores focus to the main link after closing modal', () => {
    render(
      <ShortcutGrid
        shortcuts={mockShortcuts}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    )
    const editButton = screen.getByRole('button', { name: 'Modifier le raccourci GitHub' })
    editButton.focus()
    fireEvent.click(editButton)
    fireEvent.click(screen.getByLabelText('Fermer'))
    const link = document.querySelector('.claritab-shortcut-tile')
    expect(document.activeElement).toBe(link)
  })

  it('shows delete action only in edit mode', () => {
    render(
      <ShortcutGrid
        shortcuts={mockShortcuts}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    )
    fireEvent.click(screen.getByLabelText('Ajouter un raccourci'))
    expect(screen.queryByText('Supprimer cet élément')).toBeNull()

    fireEvent.click(screen.getByLabelText('Fermer'))
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le raccourci GitHub' }))
    expect(screen.getByText('Supprimer cet élément')).toBeDefined()
  })

  it('deletes shortcut with confirmation from modal', () => {
    const onDelete = vi.fn()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(
      <ShortcutGrid
        shortcuts={mockShortcuts}
        onAdd={vi.fn()}
        onDelete={onDelete}
        onUpdate={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le raccourci GitHub' }))
    fireEvent.click(screen.getByText('Supprimer cet élément'))
    fireEvent.click(screen.getByText('Confirmer la suppression'))
    expect(onDelete).toHaveBeenCalledWith('1')
    confirmSpy.mockRestore()
  })

  it('does not delete shortcut when confirmation is cancelled', () => {
    const onDelete = vi.fn()
    render(
      <ShortcutGrid
        shortcuts={mockShortcuts}
        onAdd={vi.fn()}
        onDelete={onDelete}
        onUpdate={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le raccourci GitHub' }))
    fireEvent.click(screen.getByText('Supprimer cet élément'))
    expect(screen.getByText('Confirmer la suppression')).toBeDefined()
    expect(onDelete).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Modifier le raccourci GitHub' })).toBeDefined()
  })

  it('does not force new tab on shortcut link', () => {
    render(
      <ShortcutGrid
        shortcuts={mockShortcuts}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
      />
    )
    const link = document.querySelector('.claritab-shortcut-tile')
    expect(link).toHaveAttribute('href', 'https://github.com')
    expect(link).not.toHaveAttribute('target', '_blank')
  })

  it('blocks link navigation after drag activation', async () => {
    const ref = { current: null as ShortcutGridHandle | null }
    render(
      <ShortcutGrid
        ref={ref}
        shortcuts={mockShortcuts}
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        onUpdate={vi.fn()}
        onReorder={vi.fn()}
      />
    )

    ref.current?.activateDragForTest('1')

    const link = document.querySelector('.claritab-shortcut-tile') as HTMLAnchorElement | null
    expect(link).not.toBeNull()

    const preventSpy = vi.spyOn(Event.prototype, 'preventDefault')
    fireEvent.click(link!)
    expect(preventSpy).toHaveBeenCalled()
    preventSpy.mockRestore()
    ref.current?.deactivateDragForTest()
  })
})
