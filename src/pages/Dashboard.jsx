import DashboardCards from "../components/DashboardCards"
import SalesChart from "../components/SalesChart"
import TopProducts from "../components/TopProducts"

function Dashboard() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Overview of your store performance
        </p>
      </div>

      {/* CARDS */}
      <DashboardCards />

      {/* CHART SECTION (IMPORTANT FIX) */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Sales Analytics
        </h2>

        <SalesChart />

        <TopProducts />

      </div>

    </div>
  )
}

export default Dashboard