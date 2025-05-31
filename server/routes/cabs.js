import express from "express"
import Cab from "../models/Cab.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// @route   GET api/cabs
// @desc    Get all cab types
// @access  Public
router.get("/", async (req, res) => {
  try {
    const cabs = await Cab.find()
    res.json(cabs)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/cabs/:id
// @desc    Get cab by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const cab = await Cab.findById(req.params.id)

    if (!cab) {
      return res.status(404).json({ msg: "Cab not found" })
    }

    res.json(cab)
  } catch (err) {
    console.error(err.message)

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Cab not found" })
    }

    res.status(500).send("Server Error")
  }
})

// @route   POST api/cabs
// @desc    Create a cab type (admin only)
// @access  Private/Admin
router.post("/", auth, async (req, res) => {
  const { name, description, capacity, baseFare, perKmRate, perMinuteRate, image } = req.body

  try {
    // Create new cab
    const newCab = new Cab({
      name,
      description,
      capacity,
      baseFare,
      perKmRate,
      perMinuteRate,
      image,
    })

    const cab = await newCab.save()
    res.json(cab)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

export default router

