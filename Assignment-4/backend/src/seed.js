require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital_appointment_system';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Appointment.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    const adminUser = await User.create({
      name: 'Admin Officer',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'Admin',
    });

    const regularUser = await User.create({
      name: 'John Patient',
      email: 'user@example.com',
      password: passwordHash,
      role: 'User',
    });

    console.log('Created Demo Users:');
    console.log(' - Admin: admin@example.com / password123');
    console.log(' - User:  user@example.com / password123');

    await Appointment.create([
      {
        patientName: 'John Patient',
        doctorName: 'Dr. Sarah Jenkins',
        date: '2026-10-18',
        time: '10:00 AM',
        department: 'Cardiology',
        status: 'Confirmed',
        userId: regularUser._id,
      },
      {
        patientName: 'Alice Smith',
        doctorName: 'Dr. Marcus Vance',
        date: '2026-10-19',
        time: '02:30 PM',
        department: 'Neurology',
        status: 'Pending',
        userId: regularUser._id,
      },
    ]);

    console.log('Created sample appointments successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
