"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import Map from "../../components/Map"

const DriverDashboard = () => {
  const { user, updateDriverStatus } = useContext(AuthContext)
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable || false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [currentRide, setCurrentRide] = useState(null)
  const [rideHistory, setRideHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Get driver's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          setError("Could not get your location. Please enable location services.")
        },
      )
    } else {
      setError("Geolocation is not supported by your browser.")
    }

    // For demo purposes, we'll use localStorage to get ride history
    try {
      const storedRides = localStorage.getItem("rideHistory")
      if (storedRides) {
        const rides = JSON.parse(storedRides)
        // Filter rides assigned to this driver (in a real app, this would come from the API)
        const driverRides = rides.filter((ride) => ride.driver && ride.driver.name === user?.name)

        // Find current ride (if any)
        const active = driverRides.find((ride) => ride.status === "confirmed" || ride.status === "in-progress")

        if (active) {
          setCurrentRide(active)
        }

        setRideHistory(driverRides.filter((ride) => ride.status === "completed"))
      }
    } catch (err) {
      console.error("Error loading ride history:", err)
    }

    setLoading(false)
  }, [user])

  const handleStatusChange = async () => {
    const newStatus = !isAvailable
    const result = await updateDriverStatus(newStatus)

    if (result.success) {
      setIsAvailable(newStatus)
    } else {
      setError(result.error)
    }
  }

  const handleStartRide = () => {
    if (!currentRide) return

    try {
      // Update ride status to in-progress
      const updatedRide = { ...currentRide, status: "in-progress" }
      setCurrentRide(updatedRide)

      // Update in localStorage
      const rides = JSON.parse(localStorage.getItem("rideHistory") || "[]")
      const updatedRides = rides.map((ride) => (ride._id === currentRide._id ? updatedRide : ride))
      localStorage.setItem("rideHistory", JSON.stringify(updatedRides))

      // Update in sessionStorage if this is the current booking
      const currentBooking = JSON.parse(sessionStorage.getItem("currentBooking") || "{}")
      if (currentBooking._id === currentRide._id) {
        sessionStorage.setItem("currentBooking", JSON.stringify(updatedRide))
      }
    } catch (err) {
      console.error("Error starting ride:", err)
      setError("Failed to start ride")
    }
  }

  const handleCompleteRide = () => {
    if (!currentRide) return

    try {
      // Update ride status to completed
      const updatedRide = { ...currentRide, status: "completed" }

      // Add to ride history and clear current ride
      setRideHistory([updatedRide, ...rideHistory])
      setCurrentRide(null)

      // Update in localStorage
      const rides = JSON.parse(localStorage.getItem("rideHistory") || "[]")
      const updatedRides = rides.map((ride) => (ride._id === currentRide._id ? updatedRide : ride))
      localStorage.setItem("rideHistory", JSON.stringify(updatedRides))

      // Update in sessionStorage if this is the current booking
      const currentBooking = JSON.parse(sessionStorage.getItem("currentBooking") || "{}")
      if (currentBooking._id === currentRide._id) {
        sessionStorage.setItem("currentBooking", JSON.stringify(updatedRide))
      }
    } catch (err) {
      console.error("Error completing ride:", err)
      setError("Failed to complete ride")
    }
  }

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="driver-dashboard">
      <h2 className="form-title">Driver Dashboard</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="driver-status-card">
        <div className="driver-status-header">
          <h3>Your Status</h3>
          <div className={`status-indicator ${isAvailable ? "active" : "inactive"}`}>
            {isAvailable ? "Available" : "Unavailable"}
          </div>
        </div>

        <div className="driver-info-summary">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Vehicle:</strong> {user?.vehicleModel} ({user?.vehicleNumber})
          </p>
          <p>
            <strong>Rating:</strong> {user?.rating || "5.0"} ★
          </p>
          <p>
            <strong>Total Rides:</strong> {user?.totalRides || rideHistory.length}
          </p>
        </div>

        <button className={`btn ${isAvailable ? "btn-danger" : "btn-success"} btn-block`} onClick={handleStatusChange}>
          {isAvailable ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {currentLocation && (
        <div className="driver-location-card">
          <h3>Your Current Location</h3>
          <Map pickup={currentLocation} />
        </div>
      )}

      {currentRide ? (
        <div className="current-ride-card">
          <h3>Current Ride</h3>

          <div className="ride-details-summary">
            <div className="ride-locations">
              <p>
                <strong>From:</strong> {currentRide.pickup.address}
              </p>
              <p>
                <strong>To:</strong> {currentRide.destination.address}
              </p>
            </div>

            <div className="ride-info-grid">
              <div className="ride-info-item">
                <span className="info-label">Distance</span>
                <span className="info-value">{currentRide.distance.toFixed(2)} km</span>
              </div>
              <div className="ride-info-item">
                <span className="info-label">Fare</span>
                <span className="info-value">₹{currentRide.fare}</span>
              </div>
              <div className="ride-info-item">
                <span className="info-label">Status</span>
                <span className="info-value status-badge">{currentRide.status}</span>
              </div>
            </div>

            <div className="ride-actions">
              {currentRide.status === "confirmed" && (
                <button className="btn btn-primary" onClick={handleStartRide}>
                  Start Ride
                </button>
              )}

              {currentRide.status === "in-progress" && (
                <button className="btn btn-success" onClick={handleCompleteRide}>
                  Complete Ride
                </button>
              )}
            </div>
          </div>

          {currentRide.pickup && currentRide.destination && (
            <div className="ride-map">
              <Map
                pickup={currentRide.pickup.coordinates}
                destination={currentRide.destination.coordinates}
                driverLocation={currentLocation}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="no-ride-card">
          <h3>No Active Ride</h3>
          <p>You don't have any active rides at the moment. When you're assigned a ride, it will appear here.</p>
        </div>
      )}

      <div className="ride-history-section">
        <h3>Recent Rides</h3>

        {rideHistory.length === 0 ? (
          <p>You haven't completed any rides yet.</p>
        ) : (
          <div className="ride-history-list">
            {rideHistory.map((ride) => (
              <div key={ride._id} className="ride-history-item">
                <div className="ride-history-header">
                  <span className="ride-date">{new Date(ride.createdAt).toLocaleDateString()}</span>
                  <span className="ride-fare">₹{ride.fare}</span>
                </div>

                <div className="ride-locations">
                  <p>
                    <strong>From:</strong> {ride.pickup.address}
                  </p>
                  <p>
                    <strong>To:</strong> {ride.destination.address}
                  </p>
                </div>

                <div className="ride-stats">
                  <span>{ride.distance.toFixed(2)} km</span>
                  <span>•</span>
                  <span>{ride.rating ? `${ride.rating} ★` : "Not rated"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DriverDashboard
