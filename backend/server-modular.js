const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
require("dotenv").config()

const taskRoutes = require("./routes/tasks")

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

// Routes
app.use("/api/tasks", taskRoutes)

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
