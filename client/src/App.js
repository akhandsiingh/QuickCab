import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import BookCab from "./pages/BookCab"
import RideDetails from "./pages/RideDetails"
import Profile from "./pages/Profile"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminDrivers from "./pages/admin/AdminDrivers"
import AdminBookings from "./pages/admin/AdminBookings"
import AdminLogin from "./pages/admin/AdminLogin"
import DriverLogin from "./pages/driver/DriverLogin"
import DriverSignup from "./pages/driver/DriverSignup"
import DriverDashboard from "./pages/driver/DriverDashboard"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import DriverRoute from "./components/DriverRoute"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/driver/login" element={<DriverLogin />} />
              <Route path="/driver/signup" element={<DriverSignup />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* User Routes */}
              <Route
                path="/book-cab"
                element={
                  <ProtectedRoute>
                    <BookCab />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ride/:id"
                element={
                  <ProtectedRoute>
                    <RideDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Driver Routes */}
              <Route
                path="/driver/dashboard"
                element={
                  <DriverRoute>
                    <DriverDashboard />
                  </DriverRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/drivers"
                element={
                  <AdminRoute>
                    <AdminDrivers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <AdminRoute>
                    <AdminBookings />
                  </AdminRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
