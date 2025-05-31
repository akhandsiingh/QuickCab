"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalRides: 0,
    activeRides: 0,
    revenue: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For demo purposes, we'll use localStorage to get data
    const fetchData = () => {
      try {
        // Get ride history
        const rideHistory = JSON.parse(localStorage.getItem("rideHistory")) || []

        // Calculate stats
        const activeRides = rideHistory.filter(
          (ride) => ride.status === "confirmed" || ride.status === "in-progress",
        ).length

        const totalRevenue = rideHistory.reduce((sum, ride) => sum + (ride.fare || 0), 0)

        // Set stats
        setStats({
          totalUsers: 25, // Mock data
          totalDrivers: 10, // Mock data
          totalRides: rideHistory.length,
          activeRides,
          revenue: totalRevenue,
        })

        // Get recent bookings
        const sortedBookings = [...rideHistory]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)

        setRecentBookings(sortedBookings)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="admin-dashboard">
      <h2 className="form-title">Admin Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon user-icon">
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
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
          <Link to="/admin/users" className="stat-link">
            View All
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon driver-icon">
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
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <path d="M9 17h6"></path>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Drivers</h3>
            <p className="stat-value">{stats.totalDrivers}</p>
          </div>
          <Link to="/admin/drivers" className="stat-link">
            View All
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon ride-icon">
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
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Rides</h3>
            <p className="stat-value">{stats.totalRides}</p>
          </div>
          <Link to="/admin/bookings" className="stat-link">
            View All
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-icon">
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
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Active Rides</h3>
            <p className="stat-value">{stats.activeRides}</p>
          </div>
          <Link to="/admin/bookings" className="stat-link">
            View All
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue-icon">
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
            >
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats.revenue}</p>
          </div>
        </div>
      </div>

      <div className="admin-content-grid">
        <div className="recent-bookings">
          <h3>Recent Bookings</h3>

          {recentBookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <div className="booking-list">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="booking-item">
                  <div className="booking-header">
                    <span className="booking-id">#{booking._id.substring(0, 8)}</span>
                    <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                  </div>

                  <div className="booking-details">
                    <p>
                      <strong>From:</strong> {booking.pickup.address}
                    </p>
                    <p>
                      <strong>To:</strong> {booking.destination.address}
                    </p>
                    <p>
                      <strong>User:</strong> {booking.user?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Driver:</strong> {booking.driver?.name || "Unassigned"}
                    </p>
                  </div>

                  <div className="booking-footer">
                    <span className="booking-fare">₹{booking.fare}</span>
                    <span className="booking-date">{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link to="/admin/bookings" className="view-all-link">
            View All Bookings
          </Link>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>

          <div className="action-buttons">
            <Link to="/admin/users" className="action-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Add New User
            </Link>

            <Link to="/admin/drivers" className="action-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
              Add New Driver
            </Link>

            <Link to="/admin/bookings" className="action-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Create New Booking
            </Link>

            <button className="action-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
