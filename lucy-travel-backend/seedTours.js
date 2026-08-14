require('dotenv').config();
const mongoose = require('mongoose');

const tours = [
  { 
    name: "Ella", 
    description: "Ella is a scenic mountain village in Sri Lanka, famous for lush green hills, waterfalls, tea plantations, and breathtaking viewpoints like Ella Rock and Nine Arches Bridge.", 
    duration: "2 Days", 
    places: "Ella Rock, Nine Arches Bridge, Little Adam's Peak", 
    price: "$150",
    image: "",
    backgroundImage: "",
    itinerary: "Day 1: Arrival and Nine Arches Bridge visit\nDay 2: Ella Rock hike and Little Adam's Peak",
    accommodation: "Mountain view hotels and guesthouses",
    transportation: "Private vehicle with driver",
    included: "Accommodation, Transportation, Guide, Entrance fees",
    excluded: "Meals, Personal expenses, Tips"
  },
  { 
    name: "Yala National Park", 
    description: "Yala National Park is Sri Lanka's most famous wildlife sanctuary, home to leopards, elephants, and diverse bird species in stunning natural landscapes.", 
    duration: "1 Day", 
    places: "Safari Tour, Wildlife Spotting, Nature Trails", 
    price: "$200",
    image: "",
    backgroundImage: "",
    itinerary: "Full day safari with morning and evening game drives",
    accommodation: "Safari lodge near the park",
    transportation: "4WD safari vehicle",
    included: "Safari jeep, Driver guide, Park entrance",
    excluded: "Meals, Accommodation, Personal expenses"
  },
  { 
    name: "Mirissa", 
    description: "Mirissa is a stunning beach destination in Sri Lanka, known for whale watching, surfing, and relaxing coastal views.", 
    duration: "2 Days", 
    places: "Whale Watching, Secret Beach, Coconut Hill", 
    price: "$180",
    image: "",
    backgroundImage: "",
    itinerary: "Day 1: Whale watching tour and beach relaxation\nDay 2: Secret Beach and Coconut Hill visit",
    accommodation: "Beachfront hotels and resorts",
    transportation: "Air-conditioned vehicle",
    included: "Whale watching boat, Transportation, Guide",
    excluded: "Accommodation, Meals, Personal expenses"
  },
  { 
    name: "Sigiriya", 
    description: "Sigiriya is a historic rock fortress in Sri Lanka, known for its ancient art, advanced water systems, and stunning ruins.", 
    duration: "1 Day", 
    places: "Sigiriya Rock, Pidurangala Rock, Museum", 
    price: "$120",
    image: "",
    backgroundImage: "",
    itinerary: "Morning climb to Sigiriya Rock and afternoon Pidurangala Rock visit",
    accommodation: "Heritage hotels nearby",
    transportation: "Private vehicle with driver",
    included: "Transportation, Guide, Entrance tickets",
    excluded: "Accommodation, Meals, Personal expenses"
  },
  { 
    name: "Galle City", 
    description: "Galle is a historic coastal city featuring a UNESCO World Heritage Dutch Fort, colonial architecture, and charming streets with cafes and boutiques.", 
    duration: "1 Day", 
    places: "Galle Fort, Lighthouse, Dutch Museum", 
    price: "$100",
    image: "",
    backgroundImage: "",
    itinerary: "Walking tour of Galle Fort, lighthouse visit, and museum exploration",
    accommodation: "Colonial heritage hotels",
    transportation: "Private vehicle",
    included: "Transportation, Walking tour guide, Museum tickets",
    excluded: "Accommodation, Meals, Personal shopping"
  },
  { 
    name: "Polonnaruwa", 
    description: "Polonnaruwa is an ancient city showcasing well-preserved ruins, temples, and statues from Sri Lanka's medieval capital era.", 
    duration: "1 Day", 
    places: "Ancient Ruins, Gal Vihara, Royal Palace", 
    price: "$130",
    image: "",
    backgroundImage: "",
    itinerary: "Full day exploration of ancient ruins and archaeological sites",
    accommodation: "Cultural heritage hotels",
    transportation: "Private vehicle with driver",
    included: "Transportation, Archaeological guide, Site tickets",
    excluded: "Accommodation, Meals, Personal expenses"
  },
  { 
    name: "Nuwara Eliya", 
    description: "Nuwara Eliya is a picturesque hill station known as 'Little England', famous for cool climate, tea estates, colonial architecture, and beautiful gardens.", 
    duration: "2 Days", 
    places: "Tea Plantations, Gregory Lake, Victoria Park", 
    price: "$160",
    image: "",
    backgroundImage: "",
    itinerary: "Day 1: Tea plantation tour and factory visit\nDay 2: Gregory Lake and Victoria Park exploration",
    accommodation: "Colonial style hotels",
    transportation: "Private vehicle with driver",
    included: "Transportation, Tea plantation tour, Guide",
    excluded: "Accommodation, Meals, Personal expenses"
  },
  { 
    name: "Kandy", 
    description: "Kandy is a sacred city home to the Temple of the Tooth Relic, surrounded by mountains, lakes, and rich cultural heritage.", 
    duration: "1 Day", 
    places: "Temple of Tooth, Kandy Lake, Botanical Garden", 
    price: "$110",
    image: "",
    backgroundImage: "",
    itinerary: "Temple of Tooth visit, Kandy Lake walk, and Royal Botanical Garden tour",
    accommodation: "City center hotels",
    transportation: "Private vehicle with driver",
    included: "Transportation, Temple tickets, Garden entrance",
    excluded: "Accommodation, Meals, Personal expenses"
  },
  { 
    name: "Jaffna", 
    description: "Jaffna is a vibrant northern city with unique Tamil culture, historic temples, Dutch forts, and pristine islands.", 
    duration: "2 Days", 
    places: "Nallur Temple, Jaffna Fort, Casuarina Beach", 
    price: "$140",
    image: "",
    backgroundImage: "",
    itinerary: "Day 1: Nallur Temple and Jaffna Fort exploration\nDay 2: Casuarina Beach and local cultural sites",
    accommodation: "Local guesthouses and hotels",
    transportation: "Private vehicle with driver",
    included: "Transportation, Cultural guide, Temple visits",
    excluded: "Accommodation, Meals, Personal expenses"
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    
    // Clear existing packages
    await db.collection('packages').deleteMany({});
    console.log('Cleared existing packages');
    
    // Insert new packages
    await db.collection('packages').insertMany(tours);
    console.log('Inserted', tours.length, 'tour packages');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
