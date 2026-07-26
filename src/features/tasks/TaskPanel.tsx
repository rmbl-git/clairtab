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
      setError("Task cannot be empty.")
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
          New task
        </label>
        <input
          id="task-input"
          ref={inputRef}
          type="text"
          className="claritab-task-input"
          placeholder="What do you want to accomplish?"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            if (error) setError(null)
          }}
          maxLength={160}
          aria-describedby={error ? 'task-error' : undefined}
        />
        <button type="submit" className="claritab-task-add" aria-label="Add task">
          +
        </button>
      </div>
      {error && (
        <p id="task-error" className="claritab-task-error" role="alert">
          {error}
        </p>
      )}
      {activeTasks.length > 0 && (
        <ul className="claritab-task-list" aria-label="Active tasks">
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
                aria-label={`Delete ${task.title}`}
              >
                ×
              </button>
            </li>
          ))}
          {activeTasks.length > 3 && (
            <li className="claritab-task-more">
              {activeTasks.length - 3} more {activeTasks.length - 3 === 1 ? 'task' : 'tasks'}
            </li>
          )}
        </ul>
      )}
      {showCompleted && completedTasks.length > 0 && (
        <>
          <h3 className="claritab-section-label">Completed</h3>
          <ul className="claritab-task-list claritab-task-list-completed" aria-label="Completed tasks">
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
                  aria-label={`Delete ${task.title}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="claritab-clear-completed" onClick={onClearCompleted}>
            Clear completed tasks
          </button>
        </>
      )}
      {tasks.length === 0 && (
        <p className="claritab-empty">No tasks yet. Add one to get started.</p>
      )}
    </form>
  )
}