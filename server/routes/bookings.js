import express from "express"
import Booking from "../models/Booking.js"
import Cab from "../models/Cab.js"
import Driver from "../models/Driver.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post("/", auth, async (req, res) => {
  const { pickup, destination, cabType, fare, distance, duration, paymentMethod } = req.body

  try {
    // Verify cab type exists
    const cab = await Cab.findById(cabType)
    if (!cab) {
      return res.status(404).json({ msg: "Cab type not found" })
    }

    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      cabType,
      pickup,
      destination,
      fare,
      distance,
      duration,
      paymentMethod: paymentMethod || "cash",
      status: "pending",
    })

    // Save booking
    const booking = await newBooking.save()

    // Find nearest available driver (simplified version)
    // In a real app, you would use geospatial queries to find the nearest driver
    const driver = await Driver.findOne({ isAvailable: true })

    if (driver) {
      // Assign driver to booking
      booking.driver = driver._id
      booking.status = "confirmed"
      await booking.save()

      // Update driver availability
      driver.isAvailable = false
      await driver.save()
    }

    // Return booking with populated cab and driver info
    const populatedBooking = await Booking.findById(booking._id)
      .populate("cabType")
      .populate("driver", "name photo vehicleModel vehicleNumber phone")

    res.json(populatedBooking)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("cabType")
      .populate("driver", "name photo vehicleModel vehicleNumber phone")

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" })
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    res.json(booking)
  } catch (err) {
    console.error(err.message)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Booking not found" })
    }

    res.status(500).send("Server Error")
  }
})

// @route   GET api/bookings/my-bookings
// @desc    Get all bookings for current user
// @access  Private
router.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("cabType", "name")
      .populate("driver", "name photo")

    res.json(bookings)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   PUT api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put("/:id/status", auth, async (req, res) => {
  const { status } = req.body

  // Check if status is valid
  if (!["pending", "confirmed", "in-progress", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" })
  }

  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" })
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    // Update status
    booking.status = status

    // If booking is completed or cancelled, make driver available again
    if (status === "completed" || status === "cancelled") {
      if (booking.driver) {
        const driver = await Driver.findById(booking.driver)
        if (driver) {
          driver.isAvailable = true
          await driver.save()
        }
      }
    }

    await booking.save()

    res.json(booking)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   PUT api/bookings/:id/rating
// @desc    Add rating and feedback to booking
// @access  Private
router.put("/:id/rating", auth, async (req, res) => {
  const { rating, feedback } = req.body

  // Validate rating
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ msg: "Rating must be between 1 and 5" })
  }

  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" })
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    // Check if booking is completed
    if (booking.status !== "completed") {
      return res.status(400).json({ msg: "Can only rate completed bookings" })
    }

    // Add rating and feedback
    booking.rating = rating
    booking.feedback = feedback
    await booking.save()

    // Update driver rating
    if (booking.driver) {
      const driver = await Driver.findById(booking.driver)
      if (driver) {
        // Calculate new average rating
        const newTotalRides = driver.totalRides + 1
        const currentTotalRating = driver.rating * driver.totalRides
        const newRating = (currentTotalRating + rating) / newTotalRides

        driver.rating = newRating
        driver.totalRides = newTotalRides
        await driver.save()
      }
    }

    res.json(booking)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

export default router

