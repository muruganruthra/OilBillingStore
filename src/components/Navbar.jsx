function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">

      <h1 className="text-xl font-bold text-sky-600">
        𝗦𝗮𝗿𝗮𝘃𝗮𝗻𝗮𝘀 𝗢𝗶𝗹 𝗦𝘁𝗼𝗿𝗲
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">
          👋 {user?.name}
        </span>

        <button
          onClick={() => {
            localStorage.clear()
            window.location.href = "/login"
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg"
        >
          Logout
        </button>
      </div>

    </div>
  )
}
export default Navbar