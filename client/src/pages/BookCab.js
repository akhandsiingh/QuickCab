"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Map from "../components/Map"
import { indianCities } from "../data/indian-cities"

const BookCab = () => {
  const [pickup, setPickup] = useState(null)
  const [destination, setDestination] = useState(null)
  const [pickupAddress, setPickupAddress] = useState("")
  const [destinationAddress, setDestinationAddress] = useState("")
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [cabOptions, setCabOptions] = useState([])
  const [selectedCab, setSelectedCab] = useState(null)
  const [fare, setFare] = useState(null)
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showMap, setShowMap] = useState(false)
  const [locationEntered, setLocationEntered] = useState(false)
  const [driverLocation, setDriverLocation] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    // Fetch cab options when component mounts
    const fetchCabOptions = async () => {
      try {
        // For demo purposes, we'll create some sample cab options
        const sampleCabs = [
          {
            id: "1",
            name: "Economy",
            description: "Affordable rides for everyday use",
            capacity: 4,
            baseFare: 50,
            perKmRate: 12,
            perMinuteRate: 2,
            image: "/placeholder.svg?height=100&width=100&text=Economy",
          },
          {
            id: "2",
            name: "Premium",
            description: "Comfortable rides with extra space",
            capacity: 4,
            baseFare: 80,
            perKmRate: 15,
            perMinuteRate: 3,
            image: "/placeholder.svg?height=100&width=100&text=Premium",
          },
          {
            id: "3",
            name: "SUV",
            description: "Spacious vehicles for groups",
            capacity: 6,
            baseFare: 100,
            perKmRate: 18,
            perMinuteRate: 4,
            image: "/placeholder.svg?height=100&width=100&text=SUV",
          },
        ]
        setCabOptions(sampleCabs)
      } catch (err) {
        console.error("Error fetching cab options:", err)
        setError("Failed to load cab options")
      }
    }

    fetchCabOptions()
  }, [])

  // Handle input change for pickup location
  const handlePickupChange = (e) => {
    const value = e.target.value
    setPickupAddress(value)

    if (value.length > 1) {
      // Filter cities that match the input
      const filteredCities = indianCities
        .filter(
          (city) =>
            city.name.toLowerCase().includes(value.toLowerCase()) ||
            city.state.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 5) // Limit to 5 suggestions

      setPickupSuggestions(filteredCities)
    } else {
      setPickupSuggestions([])
    }
  }

  // Handle input change for destination
  const handleDestinationChange = (e) => {
    const value = e.target.value
    setDestinationAddress(value)

    if (value.length > 1) {
      // Filter cities that match the input
      const filteredCities = indianCities
        .filter(
          (city) =>
            city.name.toLowerCase().includes(value.toLowerCase()) ||
            city.state.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 5) // Limit to 5 suggestions

      setDestinationSuggestions(filteredCities)
    } else {
      setDestinationSuggestions([])
    }
  }

  // Handle selection of a city from suggestions
  const handleSelectCity = (city, type) => {
    if (type === "pickup") {
      setPickupAddress(`${city.name}, ${city.state}`)
      setPickup({
        lat: city.lat,
        lng: city.lng,
      })
      setPickupSuggestions([])
    } else {
      setDestinationAddress(`${city.name}, ${city.state}`)
      setDestination({
        lat: city.lat,
        lng: city.lng,
      })
      setDestinationSuggestions([])
    }
  }

  const handleLocationSelect = (type, location) => {
    if (!location) return

    try {
      if (type === "pickup") {
        setPickup(location)
        // Find the closest city to the selected location
        const closestCity = findClosestCity(location)
        if (closestCity) {
          setPickupAddress(`${closestCity.name}, ${closestCity.state}`)
        }
      } else if (type === "destination") {
        setDestination(location)
        // Find the closest city to the selected location
        const closestCity = findClosestCity(location)
        if (closestCity) {
          setDestinationAddress(`${closestCity.name}, ${closestCity.state}`)
        }
      }
    } catch (error) {
      console.error("Error handling location select:", error)
    }
  }

  // Find the closest city to a given location
  const findClosestCity = (location) => {
    if (!location || !location.lat || !location.lng) return null

    let closestCity = null
    let minDistance = Number.POSITIVE_INFINITY

    indianCities.forEach((city) => {
      if (!city || !city.lat || !city.lng) return

      try {
        const distance = calculateHaversineDistance(location.lat, location.lng, city.lat, city.lng)

        if (distance < minDistance) {
          minDistance = distance
          closestCity = city
        }
      } catch (error) {
        console.error("Error calculating distance:", error)
      }
    })

    return closestCity
  }

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0

    try {
      const R = 6371 // Radius of the Earth in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180
      const dLon = ((lon2 - lon1) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c // Distance in km
      return distance
    } catch (error) {
      console.error("Error in Haversine calculation:", error)
      return 0
    }
  }

  const handleFindCabs = () => {
    // Simple validation
    if (!pickup || !destination) {
      setError("Please select both pickup and destination cities")
      return
    }

    try {
      setLocationEntered(true)
      calculateFareWithCoordinates(pickup, destination)

      // Simulate driver location (halfway between pickup and destination)
      setTimeout(() => {
        try {
          const driverLat = (pickup.lat + destination.lat) / 2
          const driverLng = (pickup.lng + destination.lng) / 2

          // Add a slight random offset to make it more realistic
          const latOffset = (Math.random() - 0.5) * 0.05
          const lngOffset = (Math.random() - 0.5) * 0.05

          setDriverLocation({
            lat: driverLat + latOffset,
            lng: driverLng + lngOffset,
          })
        } catch (error) {
          console.error("Error setting driver location:", error)
        }
      }, 1000)
    } catch (error) {
      console.error("Error finding cabs:", error)
      setError("An error occurred while finding cabs. Please try again.")
    }
  }

  const calculateFareWithCoordinates = (pickupCoords, destCoords) => {
    if (!pickupCoords || !destCoords) return

    try {
      // Calculate actual distance using Haversine formula
      const distanceInKm = calculateHaversineDistance(
        pickupCoords.lat,
        pickupCoords.lng,
        destCoords.lat,
        destCoords.lng,
      )

      // Round to 2 decimal places
      const finalDistance = Math.round(distanceInKm * 100) / 100

      // Calculate duration (roughly 1.5 minutes per km for long distances)
      const durationInMinutes = Math.ceil(finalDistance * 1.5)

      setDistance(finalDistance)
      setDuration(durationInMinutes)

      // Calculate fare for each cab type
      const updatedCabOptions = cabOptions.map((cab) => {
        // Base fare + per km rate + per minute rate
        // For long distances, we'll apply a discount factor
        const distanceFactor = finalDistance > 100 ? 0.8 : 1 // 20% discount for long trips
        const calculatedFare =
          cab.baseFare + finalDistance * cab.perKmRate * distanceFactor + durationInMinutes * cab.perMinuteRate
        return {
          ...cab,
          calculatedFare: Math.ceil(calculatedFare), // Round up to nearest rupee
        }
      })

      setCabOptions(updatedCabOptions)

      // If a cab is already selected, update its fare
      if (selectedCab) {
        const selectedCabUpdated = updatedCabOptions.find((cab) => cab.id === selectedCab.id)
        if (selectedCabUpdated) {
          setSelectedCab(selectedCabUpdated)
          setFare(selectedCabUpdated.calculatedFare)
        }
      }
    } catch (error) {
      console.error("Error calculating fare:", error)
    }
  }

  const handleCabSelect = (cab) => {
    setSelectedCab(cab)
    setFare(cab.calculatedFare)
  }

  const handleBooking = async () => {
    if (!pickup || !destination || !selectedCab) {
      setError("Please select pickup, destination and cab type")
      return
    }

    try {
      setLoading(true)

      // Get the appropriate car image based on cab type
      let carImage
      switch (selectedCab.id) {
        case "1":
          carImage = "/placeholder.svg?height=60&width=60&text=Economy"
          break
        case "2":
          carImage = "/placeholder.svg?height=60&width=60&text=Premium"
          break
        case "3":
          carImage = "/placeholder.svg?height=60&width=60&text=SUV"
          break
        default:
          carImage = "/placeholder.svg?height=60&width=60"
      }

      // In a real app, you would send this data to your API
      const bookingData = {
        pickup: {
          coordinates: pickup,
          address: pickupAddress,
        },
        destination: {
          coordinates: destination,
          address: destinationAddress,
        },
        cabType: {
          id: selectedCab.id,
          name: selectedCab.name,
        },
        fare: fare,
        distance: distance,
        duration: duration,
        driverLocation: driverLocation,
        status: "confirmed",
        driver: {
          name: "Rahul Kumar",
          photo: carImage,
          vehicleModel:
            selectedCab.name === "Economy"
              ? "Maruti Swift"
              : selectedCab.name === "Premium"
                ? "Honda City"
                : "Toyota Innova",
          vehicleNumber: "DL-01-AB-" + Math.floor(1000 + Math.random() * 9000),
          phone: "9876543210",
        },
        paymentMethod: "Cash",
        createdAt: new Date().toISOString(),
      }

      console.log("Booking data:", bookingData)

      // Store booking data in sessionStorage
      try {
        sessionStorage.setItem("currentBooking", JSON.stringify(bookingData))
      } catch (storageError) {
        console.error("Error storing booking data:", storageError)
      }

      // Add to ride history in localStorage
      try {
        const existingRides = JSON.parse(localStorage.getItem("rideHistory")) || []
        const newRide = {
          _id: Math.floor(Math.random() * 1000000).toString(),
          ...bookingData,
        }

        localStorage.setItem("rideHistory", JSON.stringify([newRide, ...existingRides]))
      } catch (storageError) {
        console.error("Error storing ride history:", storageError)
      }

      // Generate a random booking ID
      const bookingId = Math.floor(Math.random() * 1000000)

      // Use setTimeout to ensure state updates are complete before navigation
      setTimeout(() => {
        try {
          navigate(`/ride/${bookingId}`)
        } catch (navError) {
          console.error("Navigation error:", navError)
          setError("Error navigating to ride details. Please try again.")
          setLoading(false)
        }
      }, 500)
    } catch (err) {
      console.error("Error booking cab:", err)
      setError("Failed to book cab. Please try again.")
      setLoading(false)
    }
  }

  // Format duration for display
  const formatDuration = (minutes) => {
    if (!minutes) return ""

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours} ${hours === 1 ? "hour" : "hours"}${mins > 0 ? ` ${mins} min` : ""}`
    }
    return `${mins} minutes`
  }

  return (
    <div className="book-cab-container">
      <h2 className="form-title">Book a Cab</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="location-inputs">
        <div className="form-group">
          <label htmlFor="pickup-input">Pickup City</label>
          <div className="autocomplete-container">
            <input
              id="pickup-input"
              type="text"
              className="form-control"
              placeholder="Enter pickup city"
              value={pickupAddress}
              onChange={handlePickupChange}
              autoComplete="off"
            />
            {pickupSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {pickupSuggestions.map((city, index) => (
                  <li key={index} onClick={() => handleSelectCity(city, "pickup")}>
                    {city.name}, {city.state}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="destination-input">Destination City</label>
          <div className="autocomplete-container">
            <input
              id="destination-input"
              type="text"
              className="form-control"
              placeholder="Enter destination city"
              value={destinationAddress}
              onChange={handleDestinationChange}
              autoComplete="off"
            />
            {destinationSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {destinationSuggestions.map((city, index) => (
                  <li key={index} onClick={() => handleSelectCity(city, "destination")}>
                    {city.name}, {city.state}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleFindCabs} disabled={!pickup || !destination}>
            Find Cabs
          </button>

          <button className="btn btn-secondary" onClick={() => setShowMap(!showMap)}>
            {showMap ? "Hide Map" : "Show Map"}
          </button>
        </div>
      </div>

      {showMap && (
        <Map
          pickup={pickup}
          destination={destination}
          driverLocation={driverLocation}
          onLocationSelect={handleLocationSelect}
        />
      )}

      {locationEntered && distance && duration && (
        <div className="trip-info">
          <div className="trip-info-item">
            <span className="trip-info-label">Distance</span>
            <span className="trip-info-value">{distance.toFixed(2)} km</span>
          </div>
          <div className="trip-info-item">
            <span className="trip-info-label">Estimated Time</span>
            <span className="trip-info-value">{formatDuration(duration)}</span>
          </div>
          {driverLocation && (
            <div className="trip-info-item">
              <span className="trip-info-label">Driver</span>
              <span className="trip-info-value" style={{ color: "#22c55e" }}>
                Available
              </span>
            </div>
          )}
        </div>
      )}

      {driverLocation && (
        <div className="driver-card">
          <img
            src="/placeholder.svg?height=60&width=60"
            alt="Driver"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              marginRight: "16px",
              objectFit: "cover",
            }}
          />
          <div className="driver-details">
            <h3 style={{ margin: "0 0 4px", fontSize: "18px" }}>Rahul Kumar</h3>
            <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#64748b" }}>Maruti Swift · DL-01-AB-1234</p>
            <div className="driver-contact">
              <div className="driver-contact-btn">
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="driver-contact-btn">
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {locationEntered && cabOptions.length > 0 && distance && (
        <>
          <h3 style={{ margin: "24px 0 16px", fontSize: "20px" }}>Select Cab Type</h3>
          <div className="cab-options">
            {cabOptions.map((cab) => (
              <div
                key={cab.id}
                className={`cab-option ${selectedCab && selectedCab.id === cab.id ? "selected" : ""}`}
                onClick={() => handleCabSelect(cab)}
              >
                <div className="cab-option-header">
                  <span className="cab-option-name">{cab.name}</span>
                  <span className="cab-option-price">₹{cab.calculatedFare}</span>
                </div>
                <div className="cab-option-details">
                  <p>{cab.description}</p>
                  <p>Capacity: {cab.capacity} persons</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedCab && (
        <div className="booking-summary">
          <h3>Booking Summary</h3>

          <p>
            <span className="summary-label">Cab Type</span>
            <span className="summary-value">{selectedCab.name}</span>
          </p>
          <p>
            <span className="summary-label">Pickup</span>
            <span className="summary-value">{pickupAddress}</span>
          </p>
          <p>
            <span className="summary-label">Destination</span>
            <span className="summary-value">{destinationAddress}</span>
          </p>
          <p>
            <span className="summary-label">Distance</span>
            <span className="summary-value">{distance.toFixed(2)} km</span>
          </p>
          <p>
            <span className="summary-label">Estimated Time</span>
            <span className="summary-value">{formatDuration(duration)}</span>
          </p>
          <p>
            <span className="summary-label">Fare</span>
            <span className="fare-value">₹{fare}</span>
          </p>

          <button className="btn btn-primary btn-block" onClick={handleBooking} disabled={loading}>
            {loading ? "Processing..." : "Book Now"}
          </button>
        </div>
      )}
    </div>
  )
}

export default BookCab
