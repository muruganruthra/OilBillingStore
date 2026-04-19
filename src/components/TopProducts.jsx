import { useEffect, useState } from "react"
import axios from "axios"

function TopProducts() {

  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    fetchTopProducts()
  }, [])

  const fetchTopProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/sales")
    const sales = res.data

    const productMap = {}

    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productMap[item.name]) {
          productMap[item.name] = 0
        }
        productMap[item.name] += item.quantity
      })
    })

    const sorted = Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    setTopProducts(sorted)
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Top Products</h2>

      {topProducts.map(([name, qty], index) => (
        <div key={index} className="flex justify-between border-b py-1">
          <span>{name}</span>
          <span>{qty} sold</span>
        </div>
      ))}
    </div>
  )
}

export default TopProducts