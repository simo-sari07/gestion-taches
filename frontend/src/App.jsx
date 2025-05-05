"use client"

import { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import TaskForm from "./components/TaskForm"
import TaskList from "./components/TaskList"
import Header from "./components/Header"
import LoadingSpinner from "./components/LoadingSpinner"
import React from "react"

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

function App() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/tasks`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format: Expected JSON")
      }

      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError("Failed to load tasks. Please try again later.")
      toast.error("Failed to load tasks")
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async (task) => {
    try {
      setError(null)
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const newTask = await response.json()
      setTasks([...tasks, newTask])
      toast.success("Task added successfully!")
    } catch (error) {
      console.error("Error adding task:", error)
      toast.error("Failed to add task")
    }
  }

  const deleteTask = async (id) => {
    try {
      setError(null)
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      setTasks(tasks.filter((task) => task._id !== id))
      toast.success("Task deleted successfully!")
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    }
  }

  const toggleComplete = async (id, completed) => {
    try {
      setError(null)
      const taskToUpdate = tasks.find((task) => task._id === id)
      const updatedTask = { ...taskToUpdate, completed: !completed }

      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      setTasks(tasks.map((task) => (task._id === id ? { ...task, completed: !task.completed } : task)))
      toast.success("Task updated successfully!")
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <TaskForm onAddTask={addTask} />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <TaskList tasks={tasks} onDeleteTask={deleteTask} onToggleComplete={toggleComplete} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
