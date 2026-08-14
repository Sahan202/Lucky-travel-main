require('dotenv').config();
const mongoose = require('mongoose');

const heroData = {
  title: 'Luxury Travel Experiences',
  subtitle: 'Across Sri Lanka',
  description: 'Premium tours, private transfers, handpicked destinations and unforgettable journeys tailored for discerning travelers.'
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    
    // Clear existing hero data
    await db.collection('hero').deleteMany({});
    console.log('Cleared existing hero data');
    
    // Insert hero data
    await db.collection('hero').insertOne(heroData);
    console.log('Inserted hero section data');a yatatav ganna
    
    console.log('Title:', heroData.title);
    console.log('Subtitle:', heroData.subtitle);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
