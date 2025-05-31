"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const DriverRoute = ({ children }) => {
  const { user, loading, userType } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || userType !== "driver") {
    return <Navigate to="/driver/login" />
  }

  return children
}

export default DriverRoute
