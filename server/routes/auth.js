import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    // Check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" })
    }

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
    res.status(500).send("Server Error")
  }
})

export default router

