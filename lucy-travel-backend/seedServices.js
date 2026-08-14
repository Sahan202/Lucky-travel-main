require('dotenv').config();
const mongoose = require('mongoose');

const services = [
  {
    title: "Private Tours",
    description: "Experience Sri Lanka like never before with our personalized private tours. Our expert guides will take you to hidden gems, cultural landmarks, and breathtaking locations tailored to your interests and preferences.",
    details: [
      "Day 1: Arrival & City Tour",
      "Day 2: Cultural Heritage Sites",
      "Day 3: Nature & Wildlife",
      "Day 4: Beach & Relaxation",
      "Flexible itinerary",
      "Expert local guides"
    ]
  },
  {
    title: "Airport Transfers",
    description: "Start your journey stress-free with our premium airport transfer service. Enjoy comfortable, air-conditioned vehicles with professional drivers who ensure safe and timely transportation to your destination.",
    details: [
      "24/7 availability",
      "Meet & greet service",
      "Luxury vehicles",
      "Professional drivers",
      "Flight tracking",
      "Door-to-door service"
    ]
  },
  {
    title: "Custom Packages",
    description: "Create your dream vacation with our fully customizable travel packages. From adventure tours to cultural experiences, we design unique itineraries that match your budget, timeline, and travel style perfectly.",
    details: [
      "Personalized planning",
      "Budget-friendly options",
      "Adventure activities",
      "Cultural experiences",
      "Accommodation booking",
      "Complete travel support"
    ]
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    
    // Clear existing services
    await db.collection('services').deleteMany({});
    console.log('Cleared existing services');
    
    // Insert new services
    await db.collection('services').insertMany(services);
    console.log('Inserted', services.length, 'services');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
