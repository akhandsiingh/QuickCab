// server/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cab from './models/Cab.js';
import Driver from './models/Driver.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Seed cab types
const seedCabs = async () => {
  try {
    // Clear existing cabs
    await Cab.deleteMany({});
    console.log('Cleared existing cabs');

    // Create cab types
    const cabsData = [
      {
        name: 'Economy',
        description: 'Affordable rides for everyday use',
        capacity: 4,
        baseFare: 50,
        perKmRate: 12,
        perMinuteRate: 2,
        image: '/placeholder.svg'
      },
      {
        name: 'Premium',
        description: 'Comfortable rides with extra space',
        capacity: 4,
        baseFare: 80,
        perKmRate: 15,
        perMinuteRate: 3,
        image: '/placeholder.svg'
      },
      {
        name: 'SUV',
        description: 'Spacious vehicles for groups',
        capacity: 6,
        baseFare: 100,
        perKmRate: 18,
        perMinuteRate: 4,
        image: '/placeholder.svg'
      }
    ];

    // Insert cab types
    const createdCabs = await Cab.insertMany(cabsData);
    console.log(`Seeded ${createdCabs.length} cab types`);
    return createdCabs;
  } catch (error) {
    console.error('Error seeding cabs:', error);
  }
};

// Seed drivers
const seedDrivers = async () => {
  try {
    // Clear existing drivers
    await Driver.deleteMany({});
    console.log('Cleared existing drivers');

    // Hash password for drivers
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create drivers
    const driversData = [
      {
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        password: hashedPassword,
        phone: '9876543210',
        photo: '/placeholder.svg',
        licenseNumber: 'DL-1234567890',
        vehicleModel: 'Maruti Swift',
        vehicleNumber: 'DL-01-AB-1234',
        isAvailable: true,
        currentLocation: {
          lat: 28.6139,
          lng: 77.2090
        },
        rating: 4.5,
        totalRides: 120
      },
      {
        name: 'Priya Singh',
        email: 'priya@example.com',
        password: hashedPassword,
        phone: '9876543211',
        photo: '/placeholder.svg',
        licenseNumber: 'DL-0987654321',
        vehicleModel: 'Hyundai i20',
        vehicleNumber: 'DL-02-CD-5678',
        isAvailable: true,
        currentLocation: {
          lat: 28.6129,
          lng: 77.2295
        },
        rating: 4.7,
        totalRides: 85
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        password: hashedPassword,
        phone: '9876543212',
        photo: '/placeholder.svg',
        licenseNumber: 'DL-5678901234',
        vehicleModel: 'Honda City',
        vehicleNumber: 'DL-03-EF-9012',
        isAvailable: true,
        currentLocation: {
          lat: 28.6356,
          lng: 77.2217
        },
        rating: 4.2,
        totalRides: 65
      }
    ];

    // Insert drivers
    const createdDrivers = await Driver.insertMany(driversData);
    console.log(`Seeded ${createdDrivers.length} drivers`);
    return createdDrivers;
  } catch (error) {
    console.error('Error seeding drivers:', error);
  }
};

// Run the seeding
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    await seedCabs();
    await seedDrivers();
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    mongoose.disconnect();
    console.log('Database connection closed');
  }
};

// Execute the seeding function
seedDatabase();