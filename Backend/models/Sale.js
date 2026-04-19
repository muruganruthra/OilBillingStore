import mongoose from "mongoose"

const saleSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },

  paymentType: {
    type: String,
    enum: ["cash", "credit"],
    required: true
  },

  items: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],

  subtotal: Number,
  gst: Number,
  total: Number,

  paid: {
    type: Boolean,
    default: false
  },

  // ✅ NEW FIELD (INSIDE schema)
  paymentHistory: [
    {
      amount: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],

  date: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model("Sale", saleSchema)