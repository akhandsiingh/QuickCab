"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const { name, email, phone, password, confirmPassword } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!name || !email || !phone || !password) {
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

    const result = await register(name, email, password, phone)

    if (result.success) {
      navigate("/book-cab")
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Create an Account</h2>

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
          Sign Up
        </button>
      </form>

      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

export default Signup
