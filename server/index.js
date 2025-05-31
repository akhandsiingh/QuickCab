import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Route imports
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import cabRoutes from "./routes/cabs.js"
import bookingRoutes from "./routes/bookings.js"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors())

// Define Routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/cabs", cabRoutes)
app.use("/api/bookings", bookingRoutes)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err)
    process.exit(1)
  })

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  })
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

