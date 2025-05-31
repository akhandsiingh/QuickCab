"use client"

import { useState, useEffect } from "react"

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const fetchBookings = () => {
      try {
        // For demo purposes, we'll use localStorage to get ride history
        const storedRides = localStorage.getItem("rideHistory")
        if (storedRides) {
          const rides = JSON.parse(storedRides)
          setBookings(rides)
        } else {
          // If no stored rides, create sample data
          const sampleBookings = [
            {
              _id: "1001",
              status: "completed",
              pickup: {
                address: "Delhi, Delhi",
                coordinates: { lat: 28.6139, lng: 77.209 },
              },
              destination: {
                address: "Gurgaon, Haryana",
                coordinates: { lat: 28.4595, lng: 77.0266 },
              },
              distance: 30.5,
              duration: 45,
              fare: 450,
              cabType: { name: "Premium" },
              driver: {
                name: "Rahul Kumar",
                phone: "9876543210",
                vehicleNumber: "DL-01-AB-1234",
              },
              user: {
                name: "John Doe",
                phone: "9876543211",
              },
              paymentMethod: "Cash",
              createdAt: "2023-05-15T10:30:00Z",
              rating: 4,
            },
            {
              _id: "1002",
              status: "confirmed",
              pickup: {
                address: "Mumbai, Maharashtra",
                coordinates: { lat: 19.076, lng: 72.8777 },
              },
              destination: {
                address: "Pune, Maharashtra",
                coordinates: { lat: 18.5204, lng: 73.8567 },
              },
              distance: 150.2,
              duration: 180,
              fare: 2200,
              cabType: { name: "SUV" },
              driver: {
                name: "Amit Sharma",
                phone: "9876543212",
                vehicleNumber: "MH-01-CD-5678",
              },
              user: {
                name: "Jane Smith",
                phone: "9876543213",
              },
              paymentMethod: "Card",
              createdAt: "2023-05-16T14:45:00Z",
            },
            {
              _id: "1003",
              status: "cancelled",
              pickup: {
                address: "Bangalore, Karnataka",
                coordinates: { lat: 12.9716, lng: 77.5946 },
              },
              destination: {
                address: "Mysore, Karnataka",
                coordinates: { lat: 12.2958, lng: 76.6394 },
              },
              distance: 145.8,
              duration: 170,
              fare: 2100,
              cabType: { name: "Economy" },
              user: {
                name: "Robert Johnson",
                phone: "9876543214",
              },
              paymentMethod: "Wallet",
              createdAt: "2023-05-17T09:15:00Z",
            },
          ]

          setBookings(sampleBookings)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching bookings:", err)
        setError("Failed to load bookings")
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value)
  }

  const filteredBookings = bookings.filter((booking) => {
    // Filter by status
    if (filterStatus !== "all" && booking.status !== filterStatus) {
      return false
    }

    // Filter by search term
    const searchLower = searchTerm.toLowerCase()
    return (
      booking.pickup?.address?.toLowerCase().includes(searchLower) ||
      booking.destination?.address?.toLowerCase().includes(searchLower) ||
      booking.driver?.name?.toLowerCase().includes(searchLower) ||
      booking.user?.name?.toLowerCase().includes(searchLower) ||
      booking._id.includes(searchTerm)
    )
  })

  const handleDeleteBooking = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setBookings(bookings.filter((booking) => booking._id !== id))

      // Update localStorage
      try {
        const updatedBookings = bookings.filter((booking) => booking._id !== id)
        localStorage.setItem("rideHistory", JSON.stringify(updatedBookings))
      } catch (storageError) {
        console.error("Error updating localStorage:", storageError)
      }
    }
  }

  const handleUpdateStatus = (id, newStatus) => {
    setBookings(bookings.map((booking) => (booking._id === id ? { ...booking, status: newStatus } : booking)))

    // Update localStorage
    try {
      const updatedBookings = bookings.map((booking) =>
        booking._id === id ? { ...booking, status: newStatus } : booking,
      )
      localStorage.setItem("rideHistory", JSON.stringify(updatedBookings))
    } catch (storageError) {
      console.error("Error updating localStorage:", storageError)
    }
  }

  if (loading) {
    return <div>Loading bookings...</div>
  }

  return (
    <div className="admin-bookings">
      <div className="admin-header">
        <h2>Manage Bookings</h2>
        <div className="admin-actions">
          <div className="filter-box">
            <select value={filterStatus} onChange={handleFilterChange} className="form-control">
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={handleSearch}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Route</th>
              <th>User</th>
              <th>Driver</th>
              <th>Fare</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="route-cell">
                      <div className="pickup">{booking.pickup?.address}</div>
                      <div className="destination">{booking.destination?.address}</div>
                      <div className="distance">{booking.distance?.toFixed(1)} km</div>
                    </div>
                  </td>
                  <td>
                    {booking.user?.name || "Unknown"}
                    {booking.user?.phone && <div className="phone">{booking.user.phone}</div>}
                  </td>
                  <td>
                    {booking.driver ? (
                      <>
                        <div>{booking.driver.name}</div>
                        <div className="vehicle">{booking.driver.vehicleNumber}</div>
                      </>
                    ) : (
                      "Unassigned"
                    )}
                  </td>
                  <td>₹{booking.fare}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                  </td>
                  <td className="actions-cell">
                    <div className="status-dropdown">
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                        className="form-control"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button
                      className="action-btn view-btn"
                      title="View Details"
                      onClick={() => window.open(`/ride/${booking._id}`, "_blank")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button
                      className="action-btn delete-btn"
                      title="Delete Booking"
                      onClick={() => handleDeleteBooking(booking._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminBookings
