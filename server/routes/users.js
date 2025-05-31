import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, password, phone } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ msg: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
    })

    // Save user to database
    await user.save()

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    }

    // Sign token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" }, (err, token) => {
      if (err) throw err
      res.json({ token })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/users/me
// @desc    Get current user profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/users/me
// @desc    Update user profile
// @access  Private
router.put("/me", auth, async (req, res) => {
  const { name, phone } = req.body

  // Build user object
  const userFields = {}
  if (name) userFields.name = name
  if (phone) userFields.phone = phone

  try {
    let user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    // Update user
    user = await User.findByIdAndUpdate(req.user.id, { $set: userFields }, { new: true }).select("-password")

    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

export default router

