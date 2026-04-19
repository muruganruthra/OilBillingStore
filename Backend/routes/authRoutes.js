import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    const token = jwt.sign({ id: user._id }, "secretkey")

    res.json({ user, token })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" })
    }

    const token = jwt.sign({ id: user._id }, "secretkey")

    res.json({ user, token })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router