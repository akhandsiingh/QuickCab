"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { user, loading, userType } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || userType !== "admin") {
    return <Navigate to="/login" />
  }

  return children
}

export default AdminRoute
