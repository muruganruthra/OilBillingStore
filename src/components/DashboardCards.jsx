import { useEffect, useState } from "react"
import axios from "axios"

function DashboardCards() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])

  // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      const productRes = await axios.get("http://localhost:5000/api/products")
      const salesRes = await axios.get("http://localhost:5000/api/sales")

      setProducts(productRes.data || [])
      setSales(salesRes.data || [])

    } catch (error) {
      console.error("API Error:", error)
    }
  }

  useEffect(() => {
    fetchData()

    // 🔥 AUTO REFRESH (LIVE DASHBOARD)
    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval)
  }, [])

  // ✅ CALCULATIONS
  const totalProducts = products.length

  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.stock || 0),
    0
  )

  const inventoryValue = products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0),
    0
  )

  // 🔥 LOW STOCK ALERT
  const lowStockProducts = products.filter(p => p.stock < 5)

  // 🔥 TOTAL REVENUE
  const totalRevenue = sales.reduce(
    (sum, s) => sum + Number(s.total || 0),
    0
  )

  // 🔥 TODAY REVENUE (better date logic)
  const today = new Date().toDateString()

  const todayRevenue = sales.reduce((sum, s) => {
    const saleDate = new Date(s.date).toDateString()
    return saleDate === today ? sum + Number(s.total || 0) : sum
  }, 0)

  return (
    <div className="space-y-6">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-2xl font-bold text-green-600 mt-2">
            ₹{totalRevenue.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Today Revenue</p>
          <h2 className="text-2xl font-bold text-purple-600 mt-2">
            ₹{todayRevenue.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Products</p>
          <h2 className="text-2xl font-bold text-sky-600 mt-2">
            {totalProducts}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Stock</p>
          <h2 className="text-2xl font-bold text-sky-600 mt-2">
            {totalStock}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Inventory Value</p>
          <h2 className="text-2xl font-bold text-sky-600 mt-2">
            ₹{inventoryValue.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* 🔥 LOW STOCK SECTION */}
      <div className="bg-white p-5 rounded-xl shadow">

        <h2 className="text-lg font-semibold text-red-500 mb-3">
          Low Stock Alert ⚠️
        </h2>

        {lowStockProducts.length === 0 ? (
          <p className="text-gray-500">All products are well stocked</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {lowStockProducts.map(p => (
              <div
                key={p._id}
                className="border p-2 rounded text-red-600 bg-red-50"
              >
                {p.name} → Only {p.stock} left
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  )
}

export default DashboardCards