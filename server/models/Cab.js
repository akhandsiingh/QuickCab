import mongoose from "mongoose"

const CabSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  baseFare: {
    type: Number,
    required: true,
  },
  perKmRate: {
    type: Number,
    required: true,
  },
  perMinuteRate: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
})

const Cab = mongoose.model("Cab", CabSchema)

export default Cab

