"use client"

import { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"

const Profile = () => {
  const { user } = useContext(AuthContext)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const fetchUserData = async () => {
    try {
      // For demo purposes, we'll use local storage for ride history
      let rideHistory = []
      try {
        const storedRides = localStorage.getItem("rideHistory")
        if (storedRides) {
          rideHistory = JSON.parse(storedRides)
        }
      } catch (storageError) {
        console.error("Error reading ride history from localStorage:", storageError)
      }

      setRides(rideHistory)

      // If we have a real API, we would fetch user profile and rides like this:
      if (process.env.NODE_ENV === "production") {
        try {
          // Fetch user profile
          const profileRes = await axios.get("/api/users/me")
          setProfile({
            name: profileRes.data.name,
            email: profileRes.data.email,
            phone: profileRes.data.phone,
          })

          // Fetch user's ride history
          const ridesRes = await axios.get("/api/bookings/my-bookings")
          setRides(ridesRes.data)
        } catch (apiError) {
          console.error("API error:", apiError)
        }
      } else {
        // For development, use mock data
        setProfile({
          name: user?.name || "John Doe",
          email: user?.email || "john@example.com",
          phone: user?.phone || "9876543210",
        })
      }

      setLoading(false)
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError("Failed to load user data")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [user])

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (process.env.NODE_ENV === "production") {
        await axios.put("/api/users/me", profile)
      }

      setUpdateSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile")
    }
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="profile-container">
      <h2 className="form-title">Your Profile</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {updateSuccess && <div className="alert alert-success">Profile updated successfully!</div>}

      <div className="profile-content">
        <div className="profile-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="form-control"
                readOnly
              />
              <small className="form-text text-muted">Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
        </div>

        <div className="ride-history">
          <h3>Your Ride History</h3>

          {rides.length === 0 ? (
            <p>You haven't taken any rides yet.</p>
          ) : (
            <div className="ride-list">
              {rides.map((ride) => (
                <div key={ride._id} className="ride-item">
                  <div className="ride-header">
                    <span className="ride-date">{new Date(ride.createdAt).toLocaleDateString()}</span>
                    <span className={`ride-status ${ride.status}`}>{ride.status}</span>
                  </div>

                  <div className="ride-locations">
                    <div className="pickup">
                      <strong>From:</strong> {ride.pickup.address}
                    </div>
                    <div className="destination">
                      <strong>To:</strong> {ride.destination.address}
                    </div>
                  </div>

                  <div className="ride-details-footer">
                    <span className="ride-fare">₹{ride.fare}</span>
                    <Link to={`/ride/${ride._id}`} className="ride-details-link">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
