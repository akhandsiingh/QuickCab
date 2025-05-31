import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  currentLocation: {
    lat: Number,
    lng: Number,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalRides: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
DriverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
})

// Method to compare passwords
DriverSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const Driver = mongoose.model("Driver", DriverSchema)

export default Driver

