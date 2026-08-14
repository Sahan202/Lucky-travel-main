require('dotenv').config();
const dns = require('node:dns');
const mongoose = require('mongoose');

if (process.env.DNS_SERVERS) dns.setServers(process.env.DNS_SERVERS.split(',').map(item => item.trim()).filter(Boolean));

const tours = [
  {
    name: 'Trincomalee Coast',
    description: 'Discover the clear east-coast sea, sacred viewpoints and outstanding marine experiences around Trincomalee.',
    duration: '3 Days',
    places: 'Nilaveli Beach, Pigeon Island, Koneswaram Temple, Marble Beach',
    price: 'Request Quote',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Nilaveli%20Beach%20Sri%20Lanka.jpg?width=1200',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Nilaveli_Beach_Sri_Lanka.jpg'
  },
  {
    name: 'Anuradhapura Heritage',
    description: 'Explore Sri Lanka’s first ancient capital, sacred stupas and the peaceful monastic landscape of Mihintale.',
    duration: '2 Days',
    places: 'Sri Maha Bodhi, Ruwanwelisaya, Mihintale, Isurumuniya',
    price: 'Request Quote',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ruwanwelisaya%20Stupa%20Anuradhapura.jpg?width=1200',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Ruwanwelisaya_Stupa_Anuradhapura.jpg'
  },
  {
    name: 'Bentota Escape',
    description: 'Combine a relaxing southwest beach stay with water sports, river wildlife and a beautiful garden experience.',
    duration: '2 Days',
    places: 'Bentota Beach, Bentota River, Brief Garden, Kosgoda Turtle Centre',
    price: 'Request Quote',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bentota%20Beach%20-%20panoramio.jpg?width=1200',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Bentota_Beach_-_panoramio.jpg'
  },
  {
    name: 'Udawalawe Safari',
    description: 'A wildlife-focused journey with excellent elephant sightings, open landscapes and responsible nature experiences.',
    duration: '2 Days',
    places: 'Udawalawe National Park, Elephant Transit Home, Udawalawe Reservoir',
    price: 'Request Quote',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Asian%20Elephant%20in%20Udawalawe%20National%20Park%2C%20Sri%20Lanka.jpg?width=1200',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Asian_Elephant_in_Udawalawe_National_Park,_Sri_Lanka.jpg'
  },
  {
    name: 'Dambulla & Cultural Triangle',
    description: 'Journey through cave temples, ancient capitals and village landscapes at the heart of Sri Lanka’s Cultural Triangle.',
    duration: '3 Days',
    places: 'Dambulla Cave Temple, Sigiriya, Polonnaruwa, Minneriya',
    price: 'Request Quote',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dambulla%20cave%20temple.jpg?width=1200',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Dambulla_cave_temple.jpg'
  },
  {
    name: 'Arugam Bay Surf Adventure',
    description: 'Experience Sri Lanka’s celebrated east-coast surf culture with lagoons, wildlife and relaxed beach days.',
    duration: '3 Days',
    places: 'Arugam Bay, Elephant Rock, Kumana National Park, Pottuvil Lagoon',
    price: 'Request Quote',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Arugam%20bay%20beach.jpg?width=1200',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Arugam_bay_beach.jpg'
  }
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const collection = mongoose.connection.db.collection('packages');
  for (const tour of tours) await collection.updateOne({ name: tour.name }, { $set: tour }, { upsert: true });
  console.log(`Featured tour locations ready: ${tours.length}`);
  await mongoose.disconnect();
}

run().catch(error => { console.error('Unable to add featured tours:', error.message); process.exitCode = 1; });
