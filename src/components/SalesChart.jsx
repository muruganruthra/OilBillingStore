import { useEffect, useState } from "react"
import axios from "axios"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function SalesChart() {

  const [data, setData] = useState([])

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sales")

      const sales = res.data || []

      // ✅ Convert sales into chart format
      const chartData = sales.map((sale, index) => ({
        name: new Date(sale.date).toLocaleDateString(),
        total: sale.total
      }))

      setData(chartData)

    } catch (error) {
      console.error("API Error:", error)
      setData([])
    }
  }

  return (

    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Sales Analytics
      </h2>

      {data.length === 0 ? (
        <p>No sales data</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" />
          </LineChart>
        </ResponsiveContainer>
      )}

    </div>
  )
}

export default SalesChart