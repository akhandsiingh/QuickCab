import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    cabType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cab",
      required: true,
    },
    pickup: {
      coordinates: {
        lat: Number,
        lng: Number,
      },
      address: String,
    },
    destination: {
      coordinates: {
        lat: Number,
        lng: Number,
      },
      address: String,
    },
    fare: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "wallet"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true },
)

const Booking = mongoose.model("Booking", BookingSchema)

export default Booking

