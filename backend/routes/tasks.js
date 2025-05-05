const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Task = require("../models/Task")

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    res.status(500).json({ message: "Server error while fetching tasks", error: error.message })
  }
})

// Get a single task
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" })
    }

    const task = await Task.findById(id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    res.status(500).json({ message: "Server error while fetching task", error: error.message })
  }
})

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, completed } = req.body

    // Validate required fields
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Task title is required" })
    }

    const newTask = new Task({
      title,
      description,
      completed: completed || false,
    })

    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    console.error("Error creating task:", error)

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message)
      return res.status(400).json({ message: messages.join(", ") })
    }

    res.status(500).json({ message: "Server error while creating task", error: error.message })
  }
})

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" })
    }

    // Validate required fields if title is being updated
    if (req.body.title !== undefined && (!req.body.title || req.body.title.trim() === "")) {
      return res.status(400).json({ message: "Task title cannot be empty" })
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message)
      return res.status(400).json({ message: messages.join(", ") })
    }

    res.status(500).json({ message: "Server error while updating task", error: error.message })
  }
})

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" })
    }

    const deletedTask = await Task.findByIdAndDelete(id)

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json({ message: "Task deleted successfully", taskId: id })
  } catch (error) {
    console.error("Error deleting task:", error)
    res.status(500).json({ message: "Server error while deleting task", error: error.message })
  }
})

module.exports = router
