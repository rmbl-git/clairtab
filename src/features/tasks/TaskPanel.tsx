import { useState, useRef } from 'react'

interface Props {
  tasks: Array<{
    id: string
    title: string
    completed: boolean
  }>
  onAdd: (title: string) => string | null
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onClearCompleted: () => void
  showCompleted: boolean
}

export function TaskPanel({ tasks, onAdd, onToggle, onDelete, onClearCompleted, showCompleted }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) {
      setError("La tâche ne peut pas être vide.")
      return
    }
    const err = onAdd(trimmed)
    if (err) {
      setError(err)
    } else {
      setInput('')
      setError(null)
    }
  }

  return (
    <form className="claritab-task-panel" onSubmit={handleSubmit}>
      <div className="claritab-task-input-row">
        <label htmlFor="task-input" className="sr-only">
          Nouvelle tâche
        </label>
        <input
          id="task-input"
          ref={inputRef}
          type="text"
          className="claritab-task-input"
          placeholder="Que veux-tu accomplir ?"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            if (error) setError(null)
          }}
          maxLength={160}
          aria-describedby={error ? 'task-error' : undefined}
        />
        <button type="submit" className="claritab-task-add" aria-label="Ajouter la tâche">
          +
        </button>
      </div>
      {error && (
        <p id="task-error" className="claritab-task-error" role="alert">
          {error}
        </p>
      )}
      {activeTasks.length > 0 && (
        <ul className="claritab-task-list" aria-label="Tâches actives">
          {activeTasks.slice(0, 3).map((task) => (
            <li key={task.id} className="claritab-task-item">
              <label className="claritab-task-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                />
                <span>{task.title}</span>
              </label>
              <button
                type="button"
                className="claritab-task-delete"
                onClick={() => onDelete(task.id)}
                aria-label={`Supprimer ${task.title}`}
              >
                ×
              </button>
            </li>
          ))}
          {activeTasks.length > 3 && (
            <li className="claritab-task-more">
              {activeTasks.length - 3} tâche(s) supplémentaire(s)
            </li>
          )}
        </ul>
      )}
      {showCompleted && completedTasks.length > 0 && (
        <>
          <h3 className="claritab-section-label">Terminées</h3>
          <ul className="claritab-task-list claritab-task-list-completed" aria-label="Tâches terminées">
            {completedTasks.map((task) => (
              <li key={task.id} className="claritab-task-item claritab-task-completed">
                <label className="claritab-task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                  />
                  <span>{task.title}</span>
                </label>
                <button
                  type="button"
                  className="claritab-task-delete"
                  onClick={() => onDelete(task.id)}
                  aria-label={`Supprimer ${task.title}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="claritab-clear-completed" onClick={onClearCompleted}>
            Effacer les tâches terminées
          </button>
        </>
      )}
      {tasks.length === 0 && (
        <p className="claritab-empty">Aucune tâche. Ajoutez-en une pour commencer.</p>
      )}
    </form>
  )
}