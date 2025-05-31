"use client"

import { useState, useEffect } from "react"

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDriver, setNewDriver] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    vehicleModel: "",
    vehicleNumber: "",
    password: "",
  })

  // For demo purposes, we'll create some sample drivers
  useEffect(() => {
    const fetchDrivers = () => {
      try {
        // In a real app, this would be an API call
        const sampleDrivers = [
          {
            id: "1",
            name: "Rahul Kumar",
            email: "rahul@example.com",
            phone: "9876543210",
            licenseNumber: "DL-1234567890",
            vehicleModel: "Maruti Swift",
            vehicleNumber: "DL-01-AB-1234",
            status: "active",
            isAvailable: true,
            rating: 4.8,
            rides: 120,
            joinedAt: "2022-10-15T10:30:00Z",
          },
          {
            id: "2",
            name: "Priya Singh",
            email: "priya@example.com",
            phone: "9876543211",
            licenseNumber: "DL-0987654321",
            vehicleModel: "Honda City",
            vehicleNumber: "DL-02-CD-5678",
            status: "active",
            isAvailable: false,
            rating: 4.5,
            rides: 85,
            joinedAt: "2022-11-20T14:45:00Z",
          },
          {
            id: "3",
            name: "Amit Sharma",
            email: "amit@example.com",
            phone: "9876543212",
            licenseNumber: "DL-5678901234",
            vehicleModel: "Toyota Innova",
            vehicleNumber: "DL-03-EF-9012",
            status: "blocked",
            isAvailable: false,
            rating: 3.9,
            rides: 65,
            joinedAt: "2023-01-10T09:15:00Z",
          },
          {
            id: "4",
            name: "Neha Patel",
            email: "neha@example.com",
            phone: "9876543213",
            licenseNumber: "DL-3456789012",
            vehicleModel: "Hyundai Creta",
            vehicleNumber: "DL-04-GH-3456",
            status: "active",
            isAvailable: true,
            rating: 4.9,
            rides: 150,
            joinedAt: "2022-09-05T16:20:00Z",
          },
          {
            id: "5",
            name: "Vikram Malhotra",
            email: "vikram@example.com",
            phone: "9876543214",
            licenseNumber: "DL-7890123456",
            vehicleModel: "Mahindra XUV",
            vehicleNumber: "DL-05-IJ-7890",
            status: "inactive",
            isAvailable: false,
            rating: 4.2,
            rides: 45,
            joinedAt: "2023-02-25T11:00:00Z",
          },
        ]

        setDrivers(sampleDrivers)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching drivers:", err)
        setError("Failed to load drivers")
        setLoading(false)
      }
    }

    fetchDrivers()
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDriver = () => {
    // Validate form
    if (
      !newDriver.name ||
      !newDriver.email ||
      !newDriver.phone ||
      !newDriver.licenseNumber ||
      !newDriver.vehicleModel ||
      !newDriver.vehicleNumber ||
      !newDriver.password
    ) {
      setError("Please fill all fields")
      return
    }

    // Add new driver
    const newId = (drivers.length + 1).toString()
    const driverToAdd = {
      id: newId,
      name: newDriver.name,
      email: newDriver.email,
      phone: newDriver.phone,
      licenseNumber: newDriver.licenseNumber,
      vehicleModel: newDriver.vehicleModel,
      vehicleNumber: newDriver.vehicleNumber,
      status: "active",
      isAvailable: true,
      rating: 0,
      rides: 0,
      joinedAt: new Date().toISOString(),
    }

    setDrivers([...drivers, driverToAdd])
    setShowAddModal(false)
    setNewDriver({
      name: "",
      email: "",
      phone: "",
      licenseNumber: "",
      vehicleModel: "",
      vehicleNumber: "",
      password: "",
    })
  }

  const handleDeleteDriver = (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      setDrivers(drivers.filter((driver) => driver.id !== id))
    }
  }

  const handleBlockDriver = (id) => {
    setDrivers(
      drivers.map((driver) =>
        driver.id === id ? { ...driver, status: driver.status === "blocked" ? "active" : "blocked" } : driver,
      ),
    )
  }

  const handleInputChange = (e) => {
    setNewDriver({
      ...newDriver,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return <div>Loading drivers...</div>
  }

  return (
    <div className="admin-drivers">
      <div className="admin-header">
        <h2>Manage Drivers</h2>
        <div className="admin-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={handleSearch}
              className="form-control"
            />
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            Add New Driver
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="drivers-table-container">
        <table className="drivers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Rides</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No drivers found
                </td>
              </tr>
            ) : (
              filteredDrivers.map((driver) => (
                <tr key={driver.id}>
                  <td>{driver.id}</td>
                  <td>
                    <div className="driver-name-cell">
                      <span className="driver-name">{driver.name}</span>
                      <span className="driver-email">{driver.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="driver-contact-cell">
                      <span>{driver.phone}</span>
                      <span className="driver-license">{driver.licenseNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div className="driver-vehicle-cell">
                      <span>{driver.vehicleModel}</span>
                      <span className="vehicle-number">{driver.vehicleNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div className="driver-status-cell">
                      <span className={`status-badge ${driver.status}`}>{driver.status}</span>
                      <span className={`availability-badge ${driver.isAvailable ? "available" : "unavailable"}`}>
                        {driver.isAvailable ? "Online" : "Offline"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="driver-rating">
                      <span className="rating-value">{driver.rating}</span>
                      <span className="rating-star">★</span>
                    </div>
                  </td>
                  <td>{driver.rides}</td>
                  <td className="actions-cell">
                    <button className="action-btn edit-btn" title="Edit Driver">
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
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className="action-btn block-btn"
                      title={driver.status === "blocked" ? "Unblock Driver" : "Block Driver"}
                      onClick={() => handleBlockDriver(driver.id)}
                    >
                      {driver.status === "blocked" ? (
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
                          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      ) : (
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
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                        </svg>
                      )}
                    </button>
                    <button
                      className="action-btn delete-btn"
                      title="Delete Driver"
                      onClick={() => handleDeleteDriver(driver.id)}
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

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Driver</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newDriver.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newDriver.email}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newDriver.phone}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="licenseNumber">License Number</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={newDriver.licenseNumber}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter license number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="vehicleModel">Vehicle Model</label>
                <input
                  type="text"
                  id="vehicleModel"
                  name="vehicleModel"
                  value={newDriver.vehicleModel}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter vehicle model"
                />
              </div>
              <div className="form-group">
                <label htmlFor="vehicleNumber">Vehicle Number</label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={newDriver.vehicleNumber}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter vehicle number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newDriver.password}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddDriver}>
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDrivers
