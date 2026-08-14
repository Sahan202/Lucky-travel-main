require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    
    // Update all existing tours to add backgroundImage field
    const result = await db.collection('packages').updateMany(
      { backgroundImage: { $exists: false } }, // Tours without backgroundImage field
      { 
        $set: { 
          backgroundImage: "",
          itinerary: "",
          accommodation: "",
          transportation: "",
          included: "",
          excluded: ""
        } 
      }
    );
    
    console.log(`Updated ${result.modifiedCount} tours with new fields`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });