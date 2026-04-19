import { NavLink } from "react-router-dom"
import {
  FaChartPie,
  FaBox,
  FaFileInvoiceDollar,
  FaShoppingCart,
  FaUserClock
} from "react-icons/fa"

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"))

  const linkClass =
    "flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-sky-100 transition"

  const activeClass = "bg-sky-500 text-white"

  return (
    <div className="w-64 h-[calc(100vh-64px)] bg-gray-50 border-r shadow-sm p-5 flex flex-col justify-between">

      {/* TOP SECTION */}
      <div>
        <h1 className="text-2xl font-bold text-sky-600 mb-6">
          Oil Billing
        </h1>

        {/* USER INFO */}
        <div className="mb-8 p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">Logged in as</p>
          <p className="font-semibold text-gray-800">
            👤 {user?.name || "User"}
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-3">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <FaChartPie /> Dashboard
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <FaBox /> Products
          </NavLink>

          <NavLink
            to="/billing"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <FaFileInvoiceDollar /> Billing
          </NavLink>

          <NavLink
            to="/sales"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <FaShoppingCart /> Sales
          </NavLink>

          {/* ✅ NEW CREDIT PAGE */}
          <NavLink
            to="/credit"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <FaUserClock /> Credit Customers
          </NavLink>

        </nav>
      </div>

      {/* LOGOUT */}
      <button
        onClick={() => {
          localStorage.clear()
          window.location.href = "/login"
        }}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
      >
        Logout
      </button>

    </div>
  )
}

export default Sidebar