import { useEffect, useState, useRef } from "react"
import axios from "axios"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

function Billing() {
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState("")
  const [qty, setQty] = useState(1)
  const [cart, setCart] = useState([])

  const [customerName, setCustomerName] = useState("")
  const [paymentType, setPaymentType] = useState("cash")

  const billRef = useRef()

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products")
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // ✅ ADD TO CART
  const addToCart = () => {
    if (!selected) return alert("Select a product")

    const product = products.find(p => p._id === selected)
    if (!product) return alert("Product not found")

    const quantity = Number(qty)

    if (!quantity || quantity <= 0) {
      return alert("Enter valid quantity")
    }

    if (quantity > product.stock) {
      return alert("Not enough stock")
    }

    if (product.unit === "packet" && !Number.isInteger(quantity)) {
      return alert("Packet items must be whole numbers")
    }

    const existing = cart.find(item => item._id === product._id)

    if (existing) {
      const newQty = existing.quantity + quantity

      if (newQty > product.stock) {
        return alert("Exceeds available stock")
      }

      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: newQty }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity }])
    }

    setQty(1)
    setSelected("")
  }

  // ✅ CALCULATIONS
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const gst = subtotal * 0.18
  const cgst = gst / 2
  const sgst = gst / 2
  const total = subtotal + gst

  // ✅ SAVE BILL
  const handleBill = async () => {
    if (cart.length === 0) return alert("Cart is empty")

    if (paymentType === "credit" && !customerName.trim()) {
      return alert("Customer name required for credit")
    }

    // 🔥 CLEAN DATA FOR BACKEND
    const formattedItems = cart.map(item => ({
      productId: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }))

    try {
      const res = await axios.post("http://localhost:5000/api/sales", {
        customerName:
          paymentType === "credit"
            ? customerName.trim()
            : "Walk-in",

        paymentType,
        items: formattedItems,
        subtotal,
        gst,
        total,
        date: new Date()
      })

      console.log("SUCCESS:", res.data)
      alert("Bill saved successfully")

      // 🔄 refresh stock from backend
      fetchProducts()

      // RESET
      setCart([])
      setCustomerName("")
      setPaymentType("cash")

    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message)
      alert("Error saving bill")
    }
  }

  // ✅ PDF
  const generatePDF = async () => {
    const canvas = await html2canvas(billRef.current)
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF()
    pdf.addImage(imgData, "PNG", 10, 10, 180, 0)
    pdf.save("invoice.pdf")
  }

  // ✅ PRINT
  const printReceipt = () => {
    const content = billRef.current.innerHTML

    const win = window.open("", "", "width=300,height=600")
    win.document.write(`
      <html>
        <head>
          <style>
            body { font-family: monospace; width: 250px; }
            table { width: 100%; font-size: 12px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `)
    win.document.close()
    win.print()
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Billing</h1>

      {/* CUSTOMER */}
      <div className="flex gap-4">
        <input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
        </select>
      </div>

      {/* ADD PRODUCT */}
      <div className="flex gap-4">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border p-2 rounded w-60"
        >
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} (₹{p.price}/{p.unit}) - Stock: {p.stock}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.01"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="border p-2 rounded w-20"
        />

        <button
          onClick={addToCart}
          className="bg-sky-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* BILL */}
      <div ref={billRef} className="bg-white p-4 rounded-xl shadow">
        <div className="text-center mb-4">
          <h2 className="font-bold">Saravanna Oil Store</h2>
          <p>{new Date().toLocaleString()}</p>
          <p>Customer: {customerName || "Walk-in"}</p>
          <p>Payment: {paymentType}</p>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>₹</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.quantity} {item.unit}</td>
                <td>{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 text-sm">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>CGST: ₹{cgst.toFixed(2)}</p>
          <p>SGST: ₹{sgst.toFixed(2)}</p>
          <p className="font-bold text-lg">Total: ₹{total.toFixed(2)}</p>
        </div>

        <p className="text-center mt-4">Thank You!</p>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <button onClick={handleBill} className="bg-green-500 text-white px-6 py-2 rounded">
          Save Bill
        </button>

        <button onClick={generatePDF} className="bg-blue-500 text-white px-6 py-2 rounded">
          PDF
        </button>

        <button onClick={printReceipt} className="bg-black text-white px-6 py-2 rounded">
          Print
        </button>
      </div>

    </div>
  )
}

export default Billing