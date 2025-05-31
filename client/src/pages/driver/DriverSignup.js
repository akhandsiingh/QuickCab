"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const DriverSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    vehicleModel: "",
    vehicleNumber: "",
  })
  const [error, setError] = useState("")
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const { name, email, phone, password, confirmPassword, licenseNumber, vehicleModel, vehicleNumber } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!name || !email || !phone || !password || !licenseNumber || !vehicleModel || !vehicleNumber) {
      setError("Please enter all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    // Phone validation for India (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit Indian phone number")
      return
    }

    // Register driver with additional data
    const additionalData = {
      licenseNumber,
      vehicleModel,
      vehicleNumber,
    }

    const result = await register(name, email, password, phone, "driver", additionalData)

    if (result.success) {
      navigate("/driver/dashboard")
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Create a Driver Account</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your 10-digit phone number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="licenseNumber">Driver License Number</label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={licenseNumber}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your license number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="vehicleModel">Vehicle Model</label>
          <input
            type="text"
            id="vehicleModel"
            name="vehicleModel"
            value={vehicleModel}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your vehicle model"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="vehicleNumber">Vehicle Number</label>
          <input
            type="text"
            id="vehicleNumber"
            name="vehicleNumber"
            value={vehicleNumber}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your vehicle number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            className="form-control"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Sign Up as Driver
        </button>
      </form>

      <p className="mt-3 text-center">
        Already have a driver account? <Link to="/driver/login">Login</Link>
      </p>
    </div>
  )
}

export default DriverSignup
