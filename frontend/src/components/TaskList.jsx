"use client"

import { useState } from "react"
import { Trash2, Check, X } from "react-feather"
import React from "react"

function TaskList({ tasks, onDeleteTask, onToggleComplete }) {
  const [confirmDelete, setConfirmDelete] = useState(null)

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No tasks yet. Add a task to get started!</p>
      </div>
    )
  }

  const handleDeleteClick = (id) => {
    if (confirmDelete === id) {
      onDeleteTask(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
    }
  }

  const cancelDelete = () => {
    setConfirmDelete(null)
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Tasks ({tasks.length})</h2>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`border rounded-lg p-4 ${
              task.completed ? "bg-green-50 border-green-200" : "bg-white"
            } transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task._id, task.completed)}
                    className="h-5 w-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                    id={`task-${task._id}`}
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor={`task-${task._id}`}
                    className={`font-medium cursor-pointer ${
                      task.completed ? "line-through text-gray-500" : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </label>
                  {task.description && (
                    <p className={`mt-1 text-sm ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
                      {task.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Created: {formatDate(task.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center">
                {confirmDelete === task._id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteClick(task._id)}
                      className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      title="Confirm delete"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDeleteClick(task._id)}
                    className="p-1 text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList
