import { useEffect, useState } from "react"
import axios from "axios"

function ProductTable() {
  const [products, setProducts] = useState([])

  // ✅ Fetch products from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        console.log("Products:", res.data) // debug
        setProducts(res.data)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="bg-white shadow rounded-xl p-6">

      <h2 className="text-xl font-bold mb-4">Products</h2>

      <table className="w-full">

        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Price</th>
            <th className="text-left p-2">Stock</th>
          </tr>
        </thead>

        <tbody>

          {products.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center p-4 text-gray-500">
                No products found
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">₹{p.price}</td>
                <td className="p-2">{p.stock}</td>
              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  )
}

export default ProductTable