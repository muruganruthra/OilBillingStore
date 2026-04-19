import { useEffect, useState } from "react"
import axios from "axios"

function CreditCustomers() {

  const [creditData, setCreditData] = useState({})

  useEffect(() => {
    fetchCreditData()
  }, [])

  const fetchCreditData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sales/credit")

      const sales = res.data

      // ✅ Group by customer
      const grouped = {}

      sales.forEach(sale => {
        const name = sale.customerName || "Unknown"

        if (!grouped[name]) {
          grouped[name] = {
            total: 0,
            bills: []
          }
        }

        grouped[name].total += sale.total
        grouped[name].bills.push(sale)
      })

      setCreditData(grouped)

    } catch (err) {
      console.error(err)
    }
  }

  // ✅ MARK AS PAID
  const markAsPaid = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/sales/pay/${id}`)

      alert("Payment cleared")

      fetchCreditData() // 🔄 refresh list

    } catch (err) {
      console.error(err)
      alert("Error updating payment")
    }
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Credit Customers</h1>

      {Object.keys(creditData).length === 0 ? (
        <p>No credit customers</p>
      ) : (
        Object.entries(creditData).map(([name, data], index) => (

          <div key={index} className="bg-white p-4 rounded shadow mb-4">

            {/* CUSTOMER NAME */}
            <h2 className="text-lg font-semibold">{name}</h2>

            {/* TOTAL DUE */}
            <p className="text-red-600 font-bold">
              Total Due: ₹{data.total.toFixed(2)}
            </p>

            {/* BILL LIST */}
            <div className="mt-3 space-y-2 text-sm">

              {data.bills.map((bill, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span>
                    ₹{bill.total} - {new Date(bill.date).toLocaleString()}
                  </span>

                  <button
                    onClick={() => markAsPaid(bill._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Mark Paid
                  </button>
                  
                </div>
              ))}

            </div>

          </div>

        ))
      )}

    </div>
  )
}

export default CreditCustomers