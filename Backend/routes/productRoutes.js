import express from "express"
import Product from "../models/Product.js"

const router = express.Router()

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

// ADD PRODUCT
router.post("/", async (req, res) => {
  const product = await Product.create(req.body)
  res.json(product)
})

router.post("/", async (req, res) => {
  try {
    const { name, price, stock } = req.body

    const product = await Product.create({
      name,
      price,
      stock,
      initialStock: stock // 🔥 store original stock
    })

    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router