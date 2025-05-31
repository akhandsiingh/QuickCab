"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

// Replace all motion.div with regular divs and use CSS transitions
const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const { email, password } = formData

  useEffect(() => {
    // Add the Tailwind CSS link if it's not already in the document
    if (!document.getElementById("tailwind-css")) {
      const link = document.createElement("link")
      link.id = "tailwind-css"
      link.rel = "stylesheet"
      link.href = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
      document.head.appendChild(link)
    }
  }, [])

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || !password) {
      setError("Please enter all fields")
      setIsLoading(false)
      return
    }

    const result = await login(email, password, "admin")

    if (result.success) {
      navigate("/admin")
    } else {
      setError(result.error)
      setIsLoading(false)
    }
  }

  // For demo purposes - create a demo admin account
  const createDemoAdmin = () => {
    // In a real app, this would be done through a secure admin creation process
    // This is just for demonstration
    setIsLoading(true)

    // Create a demo admin in localStorage
    const demoAdmin = {
      id: "admin-1",
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", // In a real app, this would be hashed
      role: "admin",
    }

    // Store in localStorage for demo purposes
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if admin already exists
      const adminExists = users.some((user) => user.email === demoAdmin.email)

      if (!adminExists) {
        users.push(demoAdmin)
        localStorage.setItem("users", JSON.stringify(users))

        // Set the demo credentials in the form
        setFormData({
          email: demoAdmin.email,
          password: demoAdmin.password,
        })

        setSuccess("Demo admin created! You can now login with the credentials.")
      } else {
        setFormData({
          email: demoAdmin.email,
          password: demoAdmin.password,
        })
        setSuccess("Demo admin already exists. Login credentials are filled.")
      }
    } catch (err) {
      console.error("Error creating demo admin:", err)
      setError("Failed to create demo admin")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-500 ease-in-out animate-fadeIn">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-6">
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2"
            >
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white">Admin Login</h2>
          <p className="mt-2 text-center text-sm text-indigo-100">Access the admin dashboard to manage the system</p>
        </div>

        <div className="p-8">
          {error && (
            <div
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded animate-fadeIn"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div
              className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded animate-fadeIn"
              role="alert"
            >
              <p>{success}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="pl-10 block w-full py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="pl-10 block w-full py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ease-in-out`}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-purple-500 group-hover:text-purple-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
                {isLoading ? "Logging in..." : "Login as Admin"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need a demo account?</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 active:scale-95"
                onClick={createDemoAdmin}
                disabled={isLoading}
              >
                Create Demo Admin Account
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Not an admin?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
              >
                Login as Passenger
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
