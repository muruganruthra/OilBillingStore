import { useState, useEffect } from "react"
import axios from "axios"

function Products() {

  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [editId, setEditId] = useState(null)

  // ✅ FETCH PRODUCTS FROM BACKEND
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products")
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // ✅ ADD / UPDATE PRODUCT
  const addOrUpdateProduct = async () => {

    if (!name || !price || !stock) {
      alert("Please fill all fields")
      return
    }

    try {
      if (editId) {
        // UPDATE
        await axios.put(`http://localhost:5000/api/products/${editId}`, {
          name,
          price,
          stock
        })
        setEditId(null)
      } else {
        // CREATE
        await axios.post("http://localhost:5000/api/products", {
          name,
          price,
          stock
        })
      }

      fetchProducts()

      setName("")
      setPrice("")
      setStock("")

    } catch (err) {
      console.error(err)
      alert("Error saving product")
    }
  }

  // ✅ DELETE
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`)
      fetchProducts()
    } catch (err) {
      console.error(err)
    }
  }

  // ✅ EDIT
  const editProduct = (product) => {
    setName(product.name)
    setPrice(product.price)
    setStock(product.stock)
    setEditId(product._id) // 🔥 IMPORTANT (_id not id)
  }

  return (

    <div className="p-10 w-full">

      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Product" : "Add Product"}
        </h2>

        <div className="flex gap-4">

          <input
            className="border p-2 rounded w-full"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <button
            onClick={addOrUpdateProduct}
            className={`px-6 text-white rounded ${
              editId ? "bg-green-500" : "bg-blue-500"
            }`}
          >
            {editId ? "Update" : "Add"}
          </button>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-4">Product List</h2>

        <table className="w-full">

          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>

            {products.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No products added
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-b">

                  <td className="p-2">{p.name}</td>
                  <td className="p-2">₹{p.price}</td>
                  <td className="p-2">{p.stock}</td>

                  <td className="p-2 flex gap-2">

                    <button
                      onClick={() => editProduct(p)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Products