import express from "express"
import Sale from "../models/Sale.js"
import Product from "../models/Product.js"

const router = express.Router()

// ✅ CREATE SALE + REDUCE STOCK
router.post("/", async (req, res) => {
  try {
    const { items } = req.body

    // 🔥 VALIDATION
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in sale" })
    }

    // 🔥 CHECK STOCK BEFORE SAVING
    for (let item of items) {
      const product = await Product.findById(item.productId)

      if (!product) {
        return res.status(404).json({ error: "Product not found" })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Not enough stock for ${product.name}`
        })
      }
    }

    // ✅ SAVE SALE
    const sale = await Sale.create(req.body)

    // 🔥 REDUCE STOCK
    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      })
    }

    res.json(sale)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})


// ✅ GET ALL SALES
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find()
    res.json(sales)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ✅ CREDIT SALES
router.get("/credit", async (req, res) => {
  try {
    const creditSales = await Sale.find({
      paymentType: "credit",
      paid: false
    })
    res.json(creditSales)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ✅ MARK AS PAID
router.put("/pay/:id", async (req, res) => {
  try {
    const { amount } = req.body

    const sale = await Sale.findById(req.params.id)

    if (!sale) {
      return res.status(404).json({ error: "Sale not found" })
    }

    // 🔥 ADD PAYMENT HISTORY
    sale.paymentHistory.push({ amount })

    // 🔥 CHECK FULL PAYMENT
    const totalPaid = sale.paymentHistory.reduce(
      (sum, p) => sum + p.amount,
      0
    )

    if (totalPaid >= sale.total) {
      sale.paid = true
    }

    await sale.save()

    res.json({ message: "Payment updated" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router