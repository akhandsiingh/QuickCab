import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to QuickCab</h1>
        <p>Book a cab in minutes and travel anywhere in India</p>
        <Link to="/book-cab" className="btn btn-primary">
          Book a Cab Now
        </Link>
      </div>

      <div className="features-section">
        <div className="feature">
          <div className="feature-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h3>Real-time Tracking</h3>
          <p>Track your cab in real-time and know exactly when it will arrive</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M12 9v6"></path>
              <path d="M8 9h8"></path>
            </svg>
          </div>
          <h3>Affordable Prices</h3>
          <p>Competitive pricing with transparent fare calculation</p>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
          </div>
          <h3>Safe Rides</h3>
          <p>All our drivers are verified and trained for your safety</p>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Enter Location</h3>
            <p>Enter your pickup and destination locations</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Choose a Cab</h3>
            <p>Select from various cab options based on your needs</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Confirm & Ride</h3>
            <p>Confirm your booking and enjoy your ride</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
