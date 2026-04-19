import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import salesRoutes from "./routes/salesRoutes.js"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/sales", salesRoutes)

app.get("/", (req, res) => {
  res.send("API running")
})

app.listen(5000, () => {
  console.log("Server running on port 5000")
})