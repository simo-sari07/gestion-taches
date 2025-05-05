const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev")) // HTTP request logger

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://simosari:simo0120@clusterxx.ypkrjjp.mongodb.net/taches?retryWrites=true&w=majority&appName=Clusterxx"

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
    maxlength: [100, "Task title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Pre-save middleware to update the updatedAt field
taskSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() })
  next()
})

const Task = mongoose.model("Task", taskSchema)

// Routes
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    res.status(500).json({ message: "Server error while fetching tasks", error: error.message })
  }
})

app.get("/api/tasks/:id", async (req, res) => {
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

app.post("/api/tasks", async (req, res) => {
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

app.put("/api/tasks/:id", async (req, res) => {
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

app.delete("/api/tasks/:id", async (req, res) => {
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

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err)
  res.status(500).json({ message: "Internal server error", error: err.message })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err)
  // In production, you might want to exit the process and let a process manager restart it
  // process.exit(1)
})
