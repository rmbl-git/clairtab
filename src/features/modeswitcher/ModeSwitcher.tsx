interface Props {
  activeMode: 'focus' | 'search'
  onSwitch: (mode: 'focus' | 'search') => void
}

export function ModeSwitcher({ activeMode, onSwitch }: Props) {
  return (
    <div className="claritab-mode-switcher" role="tablist" aria-label="Mode">
      <button
        role="tab"
        aria-selected={activeMode === 'focus'}
        className={activeMode === 'focus' ? 'active' : ''}
        onClick={() => onSwitch('focus')}
        type="button"
      >
        Focus
      </button>
      <button
        role="tab"
        aria-selected={activeMode === 'search'}
        className={activeMode === 'search' ? 'active' : ''}
        onClick={() => onSwitch('search')}
        type="button"
      >
        eecherche
      </button>
    </div>
  )
}