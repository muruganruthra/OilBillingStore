import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,

  initialStock: {
    type: Number,
    required: true
  }
})

export default mongoose.model("Product", productSchema)