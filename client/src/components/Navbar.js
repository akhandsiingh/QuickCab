"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Navbar = () => {
  const { user, userType, logout } = useContext(AuthContext)

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: "8px" }}
        >
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"></path>
          <circle cx="7" cy="17" r="2"></circle>
          <path d="M9 17h6"></path>
          <circle cx="17" cy="17" r="2"></circle>
        </svg>
        QuickCab
      </Link>
      <div className="navbar-links">
        {user ? (
          userType === "admin" ? (
            // Admin Links
            <>
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/drivers">Drivers</Link>
              <Link to="/admin/bookings">Bookings</Link>
              <a href="#" onClick={logout}>
                Logout
              </a>
            </>
          ) : userType === "driver" ? (
            // Driver Links
            <>
              <Link to="/driver/dashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <a href="#" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            // Regular User Links
            <>
              <Link to="/book-cab">Book a Cab</Link>
              <Link to="/profile">Profile</Link>
              <a href="#" onClick={logout}>
                Logout
              </a>
            </>
          )
        ) : (
          // Not logged in
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/driver/login">Driver Login</Link>
            <Link to="/admin/login">Admin Login</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
