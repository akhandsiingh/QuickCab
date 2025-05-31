"use client"

import { useEffect, useRef, useState } from "react"

const Map = ({ pickup, destination, onLocationSelect, driverLocation }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const routeRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [pickupSelected, setPickupSelected] = useState(!!pickup)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  useEffect(() => {
    // Initialize the map using OpenStreetMap with Leaflet
    initMap()

    return () => {
      // Clean up
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (error) {
          console.error("Error removing map:", error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded && leafletLoaded) {
      try {
        // Clear existing markers
        markersRef.current.forEach((marker) => {
          if (marker && typeof marker.remove === "function") {
            marker.remove()
          }
        })
        markersRef.current = []

        // Clear existing route
        if (routeRef.current && typeof routeRef.current.remove === "function") {
          routeRef.current.remove()
          routeRef.current = null
        }

        // Add markers for pickup and destination if they exist
        if (pickup && pickup.lat && pickup.lng) {
          addMarker(pickup, "Pickup Location", "green")
          setPickupSelected(true)
        }

        if (destination && destination.lat && destination.lng) {
          addMarker(destination, "Destination", "red")
        }

        // Add driver location marker if available
        if (driverLocation && driverLocation.lat && driverLocation.lng) {
          addDriverMarker(driverLocation)
        }

        // If both points exist, draw a route between them
        if (pickup && pickup.lat && pickup.lng && destination && destination.lat && destination.lng) {
          drawRoute(pickup, destination)
        }
      } catch (error) {
        console.error("Error updating map:", error)
      }
    }
  }, [pickup, destination, driverLocation, mapLoaded, leafletLoaded])

  const initMap = () => {
    // Check if Leaflet is available
    if (typeof window !== "undefined" && !window.L) {
      try {
        // Check if we already have the CSS link
        const existingLink = document.querySelector('link[href*="leaflet"]')
        if (!existingLink) {
          // Load Leaflet CSS
          const linkElement = document.createElement("link")
          linkElement.rel = "stylesheet"
          linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(linkElement)
        }

        // Check if we already have the script
        const existingScript = document.querySelector('script[src*="leaflet"]')
        if (!existingScript) {
          // Load Leaflet JS
          const script = document.createElement("script")
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          script.async = true
          script.onload = () => {
            setLeafletLoaded(true)
            setTimeout(() => {
              createMap()
            }, 100)
          }
          document.head.appendChild(script)
        } else {
          // Script already exists, just set the state
          setLeafletLoaded(true)
          setTimeout(() => {
            createMap()
          }, 100)
        }
      } catch (error) {
        console.error("Error loading Leaflet:", error)
      }
    } else if (typeof window !== "undefined" && window.L) {
      setLeafletLoaded(true)
      setTimeout(() => {
        createMap()
      }, 100)
    }
  }

  const createMap = () => {
    if (typeof window === "undefined" || !window.L || !mapRef.current) return

    try {
      // Check if map already exists
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (error) {
          console.error("Error removing existing map:", error)
        }
      }

      // Default to center of India if no location is provided
      const defaultLocation = { lat: 20.5937, lng: 78.9629 }

      // Create map
      const map = window.L.map(mapRef.current).setView([defaultLocation.lat, defaultLocation.lng], 5)

      // Add OpenStreetMap tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      mapInstanceRef.current = map
      setMapLoaded(true)

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }

            if (map && typeof map.setView === "function") {
              map.setView([userLocation.lat, userLocation.lng], 12)
            }

            // If onLocationSelect is provided, call it with the user's location
            if (onLocationSelect && !pickup) {
              onLocationSelect("pickup", userLocation)
            }
          },
          () => {
            console.log("Error: The Geolocation service failed.")
          },
        )
      }

      // Add click listener to map
      map.on("click", (e) => {
        if (onLocationSelect) {
          // Determine if we're setting pickup or destination based on what's already selected
          if (!pickupSelected) {
            onLocationSelect("pickup", { lat: e.latlng.lat, lng: e.latlng.lng })
            setPickupSelected(true)
          } else {
            onLocationSelect("destination", { lat: e.latlng.lat, lng: e.latlng.lng })
          }
        }
      })
    } catch (error) {
      console.error("Error creating map:", error)
    }
  }

  const addMarker = (position, title, color) => {
    if (typeof window === "undefined" || !window.L || !mapInstanceRef.current) return

    try {
      // Create a custom icon
      const icon = window.L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      // Add marker
      const marker = window.L.marker([position.lat, position.lng], { icon }).addTo(mapInstanceRef.current)
      marker.bindPopup(title)
      markersRef.current.push(marker)

      // Center map on the marker
      mapInstanceRef.current.setView([position.lat, position.lng], 12)
    } catch (error) {
      console.error("Error adding marker:", error)
    }
  }

  const addDriverMarker = (position) => {
    if (typeof window === "undefined" || !window.L || !mapInstanceRef.current) return

    try {
      // Create a car icon
      const icon = window.L.divIcon({
        className: "driver-marker",
        html: `<div style="background-color: #4a6cf7; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"></path>
                  <circle cx="7" cy="17" r="2"></circle>
                  <path d="M9 17h6"></path>
                  <circle cx="17" cy="17" r="2"></circle>
                </svg>
              </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      // Add marker
      const marker = window.L.marker([position.lat, position.lng], { icon }).addTo(mapInstanceRef.current)
      marker.bindPopup("Driver Location")
      markersRef.current.push(marker)
    } catch (error) {
      console.error("Error adding driver marker:", error)
    }
  }

  const drawRoute = (origin, destination) => {
    if (typeof window === "undefined" || !window.L || !mapInstanceRef.current) return

    try {
      // For a simple demo, we'll just draw a straight line
      // In a real app, you would use a routing service like OSRM or GraphHopper
      const points = [
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ]

      const line = window.L.polyline(points, {
        color: "#4a6cf7",
        weight: 4,
        opacity: 0.7,
        dashArray: "10, 10",
      }).addTo(mapInstanceRef.current)

      routeRef.current = line

      // Fit the map to show the route
      mapInstanceRef.current.fitBounds(line.getBounds(), {
        padding: [50, 50],
      })
    } catch (error) {
      console.error("Error drawing route:", error)
    }
  }

  return <div ref={mapRef} className="map-container"></div>
}

export default Map

