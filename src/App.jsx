import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"

import Sidebar from "./components/Sidebar"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"

import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import Billing from "./pages/Billing"
import Sales from "./pages/Sales"
import CreditCustomers from "./pages/CreditCustomers" // ✅ NEW
import Login from "./pages/Login"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))

  useEffect(() => {
    setToken(localStorage.getItem("token"))
  }, [])

  const Layout = ({ children }) => (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-6">
          {children}
        </div>
      </div>

    </div>
  )

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
        />

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* BILLING */}
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Layout>
                <Billing />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* SALES */}
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Layout>
                <Sales />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ✅ CREDIT CUSTOMERS (NEW FEATURE) */}
        <Route
          path="/credit"
          element={
            <ProtectedRoute>
              <Layout>
                <CreditCustomers />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/login"} />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App