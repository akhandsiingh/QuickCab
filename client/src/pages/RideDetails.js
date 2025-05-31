"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Map from "../components/Map"

const RideDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeRating, setActiveRating] = useState(0)
  const [driverLocation, setDriverLocation] = useState(null)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    // Get booking data from sessionStorage
    const fetchBookingDetails = () => {
      try {
        let bookingData = null

        // Try to get booking data from sessionStorage
        try {
          const storedBooking = sessionStorage.getItem("currentBooking")
          if (storedBooking) {
            bookingData = JSON.parse(storedBooking)
          }
        } catch (sessionError) {
          console.error("Error reading from sessionStorage:", sessionError)
        }

        // If no data in sessionStorage, try to get from localStorage ride history
        if (!bookingData) {
          try {
            const rideHistory = JSON.parse(localStorage.getItem("rideHistory")) || []
            bookingData = rideHistory.find((ride) => ride._id === id)
          } catch (localStorageError) {
            console.error("Error reading from localStorage:", localStorageError)
          }
        }

        if (bookingData) {
          // Create a complete booking object with the stored data
          const completeBooking = {
            _id: id,
            status: bookingData.status || "confirmed",
            pickup: bookingData.pickup,
            destination: bookingData.destination,
            distance: bookingData.distance,
            duration: bookingData.duration,
            fare: bookingData.fare,
            cabType: bookingData.cabType || {
              name: getCabNameById(bookingData.cabType?.id || bookingData.cabType),
            },
            driver: bookingData.driver || {
              name: "Rahul Kumar",
              photo: "/placeholder.svg?height=60&width=60&text=Driver",
              vehicleModel: "Maruti Swift",
              vehicleNumber: "DL-01-AB-1234",
              phone: "9876543210",
            },
            paymentMethod: bookingData.paymentMethod || "Cash",
            createdAt: bookingData.createdAt || new Date().toISOString(),
            rating: bookingData.rating || 0,
            feedback: bookingData.feedback || "",
          }

          setBooking(completeBooking)
          setActiveRating(completeBooking.rating || 0)
          setFeedback(completeBooking.feedback || "")

          // Set driver location from the booking data or create a simulated one
          if (bookingData.driverLocation) {
            setDriverLocation(bookingData.driverLocation)
          } else if (bookingData.pickup?.coordinates && bookingData.destination?.coordinates) {
            // Create a simulated driver location moving from pickup to destination
            simulateDriverLocation(bookingData.pickup.coordinates, bookingData.destination.coordinates)
          }

          setLoading(false)
        } else {
          // If no stored booking, create a sample one
          setTimeout(() => {
            const sampleBooking = {
              _id: id,
              status: "confirmed",
              pickup: {
                coordinates: { lat: 28.6139, lng: 77.209 },
                address: "Delhi, Delhi",
              },
              destination: {
                coordinates: { lat: 19.076, lng: 72.8777 },
                address: "Mumbai, Maharashtra",
              },
              distance: 1421.5,
              duration: 1260, // 21 hours in minutes
              fare: 15800,
              cabType: { name: "Premium" },
              driver: {
                name: "Rahul Kumar",
                photo: "/placeholder.svg?height=60&width=60&text=Premium",
                vehicleModel: "Honda City",
                vehicleNumber: "DL-01-AB-1234",
                phone: "9876543210",
              },
              paymentMethod: "Cash",
              createdAt: new Date().toISOString(),
            }

            setBooking(sampleBooking)

            // Create a simulated driver location
            simulateDriverLocation(sampleBooking.pickup.coordinates, sampleBooking.destination.coordinates)

            setLoading(false)
          }, 1000)
        }
      } catch (err) {
        console.error("Error fetching booking details:", err)
        setError("Failed to load booking details")
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [id])

  // Helper function to get cab name from id
  const getCabNameById = (cabId) => {
    switch (cabId) {
      case "1":
        return "Economy"
      case "2":
        return "Premium"
      case "3":
        return "SUV"
      default:
        return "Standard"
    }
  }

  // Simulate driver location moving from pickup to destination
  const simulateDriverLocation = (pickup, destination) => {
    if (!pickup || !destination) return

    try {
      // Start at a point closer to pickup
      const factor = 0.2 // 20% of the way from pickup to destination
      const lat = pickup.lat + (destination.lat - pickup.lat) * factor
      const lng = pickup.lng + (destination.lng - pickup.lng) * factor

      // Add slight randomness
      const latOffset = (Math.random() - 0.5) * 0.01
      const lngOffset = (Math.random() - 0.5) * 0.01

      setDriverLocation({
        lat: lat + latOffset,
        lng: lng + lngOffset,
      })
    } catch (error) {
      console.error("Error simulating driver location:", error)
    }
  }

  const handleSubmitRating = () => {
    if (activeRating === 0) {
      alert("Please select a rating")
      return
    }

    try {
      // Update the booking status to completed
      const updatedBooking = {
        ...booking,
        status: "completed",
        rating: activeRating,
        feedback: feedback,
      }

      setBooking(updatedBooking)

      // Update in sessionStorage
      try {
        sessionStorage.setItem("currentBooking", JSON.stringify(updatedBooking))
      } catch (sessionError) {
        console.error("Error updating sessionStorage:", sessionError)
      }

      // Update in ride history
      try {
        const rideHistory = JSON.parse(localStorage.getItem("rideHistory")) || []
        const updatedHistory = rideHistory.map((ride) => {
          if (ride._id === booking._id) {
            return {
              ...ride,
              status: "completed",
              rating: activeRating,
              feedback: feedback,
            }
          }
          return ride
        })

        localStorage.setItem("rideHistory", JSON.stringify(updatedHistory))

        alert("Thank you for your rating!")
      } catch (storageError) {
        console.error("Error updating ride history:", storageError)
      }
    } catch (error) {
      console.error("Error submitting rating:", error)
    }
  }

  const handleEndRide = () => {
    try {
      // Update the booking status to completed
      const updatedBooking = {
        ...booking,
        status: "completed",
      }

      setBooking(updatedBooking)

      // Update in sessionStorage
      try {
        sessionStorage.setItem("currentBooking", JSON.stringify(updatedBooking))
      } catch (sessionError) {
        console.error("Error updating sessionStorage:", sessionError)
      }

      // Update in ride history
      try {
        const rideHistory = JSON.parse(localStorage.getItem("rideHistory")) || []
        const updatedHistory = rideHistory.map((ride) => {
          if (ride._id === booking._id) {
            return {
              ...ride,
              status: "completed",
            }
          }
          return ride
        })

        localStorage.setItem("rideHistory", JSON.stringify(updatedHistory))

        alert("Ride completed! Please rate your experience.")
      } catch (storageError) {
        console.error("Error updating ride history:", storageError)
      }
    } catch (error) {
      console.error("Error ending ride:", error)
    }
  }

  if (loading) {
    return (
      <div className="ride-details-container" style={{ textAlign: "center", marginTop: "100px" }}>
        <div className="loading-spinner"></div>
        <p>Loading ride details...</p>
      </div>
    )
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  if (!booking) {
    return <div className="alert alert-danger">Booking not found</div>
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed"
      case "in-progress":
        return "status-in-progress"
      case "completed":
        return "status-completed"
      default:
        return ""
    }
  }

  // Format duration to hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return ""

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${mins > 0 ? `${mins} min` : ""}`
    }
    return `${mins} minutes`
  }

  return (
    <div className="ride-details-container">
      <h2 className="form-title">Ride Details</h2>

      <div className="ride-status-container">
        <span className={`ride-status ${getStatusClass(booking.status)}`}>
          {booking.status === "confirmed" && "Confirmed - Driver on the way"}
          {booking.status === "in-progress" && "In Progress"}
          {booking.status === "completed" && "Completed"}
        </span>

        {(booking.status === "confirmed" || booking.status === "in-progress") && (
          <button className="btn btn-danger end-ride-btn" onClick={handleEndRide}>
            End Ride
          </button>
        )}
      </div>

      <div className="ride-details">
        <div className="driver-info">
          <img
            src={booking.driver?.photo || "/placeholder.svg?height=60&width=60"}
            alt="Driver"
            className="driver-photo"
            width="60"
            height="60"
          />
          <div>
            <p className="driver-name">{booking.driver?.name || "Driver not assigned yet"}</p>
            {booking.driver && (
              <p className="vehicle-info">
                {booking.driver.vehicleModel} - {booking.driver.vehicleNumber}
              </p>
            )}
          </div>
        </div>

        {driverLocation && booking.pickup && booking.destination && (
          <div className="driver-location-container">
            <h4 className="driver-location-title">
              <span className="driver-location-pin"></span>
              Live Driver Location
            </h4>
            <Map
              pickup={booking.pickup.coordinates}
              destination={booking.destination.coordinates}
              driverLocation={driverLocation}
            />
          </div>
        )}

        <div className="trip-details">
          <h3>Trip Details</h3>
          <div className="detail-row">
            <span>Pickup:</span>
            <span>{booking.pickup?.address}</span>
          </div>
          <div className="detail-row">
            <span>Destination:</span>
            <span>{booking.destination?.address}</span>
          </div>
          <div className="detail-row">
            <span>Distance:</span>
            <span>{booking.distance?.toFixed(2)} km</span>
          </div>
          <div className="detail-row">
            <span>Duration:</span>
            <span>{formatDuration(booking.duration)}</span>
          </div>
          <div className="detail-row">
            <span>Cab Type:</span>
            <span>{booking.cabType?.name}</span>
          </div>
          <div className="detail-row">
            <span>Fare:</span>
            <span>₹{booking.fare}</span>
          </div>
          <div className="detail-row">
            <span>Payment Method:</span>
            <span>{booking.paymentMethod || "Cash"}</span>
          </div>
          <div className="detail-row">
            <span>Booking Time:</span>
            <span>{new Date(booking.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {booking.status === "completed" ? (
          booking.rating ? (
            <div className="rating-section">
              <h3>Your Rating</h3>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`star ${star <= booking.rating ? "active" : ""}`}>
                    ★
                  </span>
                ))}
              </div>
              {booking.feedback && (
                <div className="feedback-display">
                  <h4>Your Feedback:</h4>
                  <p>{booking.feedback}</p>
                </div>
              )}
              <p style={{ textAlign: "center", marginTop: "1rem" }}>Thank you for your feedback!</p>
            </div>
          ) : (
            <div className="rating-section">
              <h3>Rate Your Ride</h3>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= activeRating ? "active" : ""}`}
                    onClick={() => setActiveRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                className="form-control"
                placeholder="Share your feedback (optional)"
                style={{ margin: "1rem 0" }}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
              <button className="btn btn-primary" onClick={handleSubmitRating}>
                Submit Rating
              </button>
            </div>
          )
        ) : (
          <div className="ride-actions">
            <p>Your ride is {booking.status}. You can end the ride at any time.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RideDetails
