import { useEffect, useState } from "react"
import axios from "axios"

function Sales() {
  const [sales, setSales] = useState([])

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sales")
      setSales(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // 🔥 DATE HELPERS
  const today = new Date().toLocaleDateString()

  const getWeek = (date) => {
    const d = new Date(date)
    const firstDay = new Date(d.getFullYear(), 0, 1)
    const days = Math.floor((d - firstDay) / (24 * 60 * 60 * 1000))
    return Math.ceil((days + firstDay.getDay() + 1) / 7)
  }

  const currentWeek = getWeek(new Date())

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  // 🔥 CALCULATIONS
  const dailyRevenue = sales.reduce((sum, s) => {
    const saleDate = new Date(s.date).toLocaleDateString()
    return saleDate === today ? sum + s.total : sum
  }, 0)

  const weeklyRevenue = sales.reduce((sum, s) => {
    const saleDate = new Date(s.date)
    return getWeek(saleDate) === currentWeek &&
      saleDate.getFullYear() === currentYear
      ? sum + s.total
      : sum
  }, 0)

  const monthlyRevenue = sales.reduce((sum, s) => {
    const saleDate = new Date(s.date)
    return saleDate.getMonth() === currentMonth &&
      saleDate.getFullYear() === currentYear
      ? sum + s.total
      : sum
  }, 0)

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Sales Report</h1>

      {/* 🔥 CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Today</p>
          <h2 className="text-xl font-bold text-green-600">
            ₹{dailyRevenue.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">This Week</p>
          <h2 className="text-xl font-bold text-blue-600">
            ₹{weeklyRevenue.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">This Month</p>
          <h2 className="text-xl font-bold text-purple-600">
            ₹{monthlyRevenue.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* 🔥 SALES TABLE */}
      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-lg font-semibold mb-4">
          Sales History
        </h2>

        {sales.length === 0 ? (
          <p>No sales found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Customer</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale, i) => (
                <tr key={i} className="border-b">
                  <td>{sale.customerName}</td>
                  <td
                    className={
                      sale.paymentType === "credit"
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  >
                    {sale.paymentType}
                  </td>
                  <td>₹{sale.total}</td>
                  <td>
                    {new Date(sale.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  )
}

export default Sales