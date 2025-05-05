const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI ||
      "mongodb+srv://simosari:simo0120@clusterxx.ypkrjjp.mongodb.net/taches?retryWrites=true&w=majority&appName=Clusterxx"

    const conn = await mongoose.connect(MONGO_URI)

    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
