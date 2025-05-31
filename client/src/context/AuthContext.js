"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState(null) // 'user', 'driver', or 'admin'

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")
        const type = localStorage.getItem("userType")

        if (token) {
          // Set auth token header
          axios.defaults.headers.common["x-auth-token"] = token

          // For demo purposes, we'll use localStorage to get user data
          try {
            if (type === "driver") {
              // Get driver data from localStorage
              const drivers = JSON.parse(localStorage.getItem("drivers") || "[]")
              const driverEmail = localStorage.getItem("userEmail")
              const driver = drivers.find((d) => d.email === driverEmail)

              if (driver) {
                setUser(driver)
                setUserType("driver")
              }
            } else if (type === "admin") {
              // Get admin data from localStorage
              const users = JSON.parse(localStorage.getItem("users") || "[]")
              const adminEmail = localStorage.getItem("userEmail")
              const admin = users.find((u) => u.email === adminEmail && u.role === "admin")

              if (admin) {
                setUser(admin)
                setUserType("admin")
              }
            } else {
              // Get user data from localStorage
              const users = JSON.parse(localStorage.getItem("users") || "[]")
              const userEmail = localStorage.getItem("userEmail")
              const regularUser = users.find((u) => u.email === userEmail && u.role !== "admin")

              if (regularUser) {
                setUser(regularUser)
                setUserType("user")
              }
            }
          } catch (err) {
            console.error("Error getting user data from localStorage:", err)
          }
        }
      } catch (err) {
        // If token is invalid, remove it
        localStorage.removeItem("token")
        localStorage.removeItem("userType")
        localStorage.removeItem("userEmail")
        delete axios.defaults.headers.common["x-auth-token"]
      }

      setLoading(false)
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password, type = "user") => {
    try {
      // For demo purposes, we'll use localStorage to authenticate
      let userData = null

      if (type === "driver") {
        // Check driver credentials
        const drivers = JSON.parse(localStorage.getItem("drivers") || "[]")
        userData = drivers.find((driver) => driver.email === email && driver.password === password)

        if (!userData) {
          return { success: false, error: "Invalid driver credentials" }
        }

        setUserType("driver")
      } else if (type === "admin") {
        // Check admin credentials
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        userData = users.find((user) => user.email === email && user.password === password && user.role === "admin")

        if (!userData) {
          return { success: false, error: "Invalid admin credentials" }
        }

        setUserType("admin")
      } else {
        // Check user credentials
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        userData = users.find((user) => user.email === email && user.password === password && user.role !== "admin")

        if (!userData) {
          return { success: false, error: "Invalid credentials" }
        }

        setUserType("user")
      }

      // Generate a fake token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      // Save token and user data
      localStorage.setItem("token", token)
      localStorage.setItem("userType", type)
      localStorage.setItem("userEmail", email)
      axios.defaults.headers.common["x-auth-token"] = token

      setUser(userData)

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err.message || "Login failed",
      }
    }
  }

  const register = async (name, email, password, phone, type = "user", additionalData = {}) => {
    try {
      // For demo purposes, we'll use localStorage to register
      if (type === "driver") {
        // Register driver
        const drivers = JSON.parse(localStorage.getItem("drivers") || "[]")

        // Check if driver already exists
        if (drivers.some((driver) => driver.email === email)) {
          return { success: false, error: "Driver with this email already exists" }
        }

        // Create new driver
        const newDriver = {
          id: `driver-${drivers.length + 1}`,
          name,
          email,
          password, // In a real app, this would be hashed
          phone,
          licenseNumber: additionalData.licenseNumber || "",
          vehicleModel: additionalData.vehicleModel || "",
          vehicleNumber: additionalData.vehicleNumber || "",
          status: "active",
          isAvailable: true,
          rating: 0,
          rides: 0,
          joinedAt: new Date().toISOString(),
        }

        drivers.push(newDriver)
        localStorage.setItem("drivers", JSON.stringify(drivers))

        setUser(newDriver)
        setUserType("driver")
      } else {
        // Register user
        const users = JSON.parse(localStorage.getItem("users") || "[]")

        // Check if user already exists
        if (users.some((user) => user.email === email)) {
          return { success: false, error: "User with this email already exists" }
        }

        // Create new user
        const newUser = {
          id: `user-${users.length + 1}`,
          name,
          email,
          password, // In a real app, this would be hashed
          phone,
          role: type === "admin" ? "admin" : "user",
          joinedAt: new Date().toISOString(),
        }

        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        setUser(newUser)
        setUserType(type)
      }

      // Generate a fake token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      // Save token and user data
      localStorage.setItem("token", token)
      localStorage.setItem("userType", type)
      localStorage.setItem("userEmail", email)
      axios.defaults.headers.common["x-auth-token"] = token

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err.message || "Registration failed",
      }
    }
  }

  const updateDriverStatus = async (isAvailable) => {
    try {
      if (userType !== "driver") {
        return { success: false, error: "Not authorized" }
      }

      // For demo purposes, we'll update in localStorage
      const drivers = JSON.parse(localStorage.getItem("drivers") || "[]")
      const driverIndex = drivers.findIndex((driver) => driver.email === user.email)

      if (driverIndex !== -1) {
        drivers[driverIndex].isAvailable = isAvailable
        localStorage.setItem("drivers", JSON.stringify(drivers))

        // Update user state with new status
        setUser({ ...user, isAvailable })

        return { success: true }
      }

      return { success: false, error: "Driver not found" }
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to update status",
      }
    }
  }

  const logout = () => {
    // Remove token from storage and state
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    localStorage.removeItem("userEmail")
    delete axios.defaults.headers.common["x-auth-token"]
    setUser(null)
    setUserType(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userType,
        login,
        register,
        logout,
        updateDriverStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
