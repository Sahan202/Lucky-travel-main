import { useEffect, useMemo, useState } from 'react';
import { Check, MapPin, Waves, Trees, PawPrint, Landmark, Plus, Search, X } from 'lucide-react';
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import mirissa from '../assets/Secret Beach Mirissa Sri Lanka.jpg';
import ella from '../assets/ella.jpg';
import nuwaraEliya from '../assets/Beautiful view from Nuwara Eliya, Sri Lanka.jpg';
import rainforest from '../assets/hendrik-cornelissen-jpTT_SAU034-unsplash.jpg';
import wildlife from '../assets/tommaso-delton-_sFOJHDmO6A-unsplash.jpg';
import sigiriya from '../assets/Sigiriya.jpg';
import kandy from '../assets/dalada.jpg';
import galle from '../assets/chathura-indika-LAj-XlHP6Rs-unsplash.jpg';
import jaffna from '../assets/Nallur Kovil.jpg';

type Category = 'Beaches' | 'Nature' | 'Wildlife' | 'Culture';
type Attraction = { name: string; category: Category; group: string; bestFor: string; description: string; image: string; season: string; x: number; y: number; stayBase: string };

const attractions: Attraction[] = [
  { name: 'Arugam Bay', category: 'Beaches', group: 'Surfing', bestFor: 'International surf breaks', description: 'A relaxed east-coast surf town with breaks for beginners and experienced surfers.', image: mirissa, season: 'May - September', x: 79, y: 62, stayBase: 'Arugam Bay' },
  { name: 'Hikkaduwa Beach', category: 'Beaches', group: 'Diving', bestFor: 'Coral reefs and turtles', description: 'Popular for reef diving, snorkelling, sea turtles and a lively beach atmosphere.', image: galle, season: 'November - April', x: 35, y: 84, stayBase: 'Hikkaduwa' },
  { name: 'Mirissa Beach', category: 'Beaches', group: 'Sunbathing', bestFor: 'Golden sand and sunsets', description: 'A palm-fringed crescent with swimming, coastal cafes and beautiful sunsets.', image: mirissa, season: 'November - April', x: 49, y: 91, stayBase: 'Mirissa' },
  { name: 'Marble Beach', category: 'Beaches', group: 'Scenic beach', bestFor: 'Calm crystal-clear water', description: 'A sheltered Trincomalee bay known for soft sand and exceptionally clear blue water.', image: mirissa, season: 'May - September', x: 72, y: 30, stayBase: 'Trincomalee' },
  { name: 'Unawatuna Beach', category: 'Beaches', group: 'Swimming', bestFor: 'Families and relaxed swimming', description: 'A curved southern bay close to Galle, with calm water and beachside restaurants.', image: galle, season: 'November - April', x: 40, y: 89, stayBase: 'Galle' },
  { name: 'Ella', category: 'Nature', group: 'Mountain country', bestFor: 'Hikes and scenic trains', description: 'Explore Little Adam’s Peak, Nine Arches Bridge and the misty central highlands.', image: ella, season: 'January - March', x: 59, y: 67, stayBase: 'Ella' },
  { name: 'Nuwara Eliya', category: 'Nature', group: 'Tea country', bestFor: 'Tea estates and cool climate', description: 'Rolling plantations, Gregory Lake and classic highland scenery.', image: nuwaraEliya, season: 'January - April', x: 50, y: 60, stayBase: 'Nuwara Eliya' },
  { name: 'Diyaluma Falls', category: 'Nature', group: 'Waterfalls', bestFor: 'Natural pools and adventure', description: 'A dramatic waterfall near Koslanda with panoramic upper pools and guided hikes.', image: ella, season: 'February - August', x: 62, y: 70, stayBase: 'Ella' },
  { name: 'Sinharaja Rainforest', category: 'Nature', group: 'Rainforest', bestFor: 'Biodiversity walks', description: 'A UNESCO tropical rainforest rich in endemic birds, plants and wildlife.', image: rainforest, season: 'January - April', x: 42, y: 76, stayBase: 'Sinharaja' },
  { name: 'Horton Plains', category: 'Nature', group: 'Highland trails', bestFor: 'World’s End viewpoint', description: 'Cloud forest, open grassland and one of Sri Lanka’s most memorable walking trails.', image: nuwaraEliya, season: 'January - March', x: 52, y: 64, stayBase: 'Nuwara Eliya' },
  { name: 'Yala National Park', category: 'Wildlife', group: 'Leopard safari', bestFor: 'Leopards and safari landscapes', description: 'Sri Lanka’s iconic safari park for leopards, elephants and rich birdlife.', image: wildlife, season: 'February - July', x: 68, y: 81, stayBase: 'Yala' },
  { name: 'Udawalawe National Park', category: 'Wildlife', group: 'Elephant safari', bestFor: 'Wild elephant herds', description: 'Open grasslands with reliable elephant sightings and family-friendly safaris.', image: wildlife, season: 'Year-round', x: 54, y: 77, stayBase: 'Udawalawe' },
  { name: 'Mirissa Whale Watching', category: 'Wildlife', group: 'Marine wildlife', bestFor: 'Blue whales and dolphins', description: 'Early-morning ocean excursions to observe whales and dolphin pods.', image: mirissa, season: 'November - April', x: 48, y: 89, stayBase: 'Mirissa' },
  { name: 'Minneriya National Park', category: 'Wildlife', group: 'Elephant gathering', bestFor: 'Large elephant groups', description: 'Known for the seasonal gathering of elephants around the ancient reservoir.', image: wildlife, season: 'July - October', x: 58, y: 37, stayBase: 'Sigiriya' },
  { name: 'Wilpattu National Park', category: 'Wildlife', group: 'Wilderness safari', bestFor: 'Leopards and natural lakes', description: 'A quieter safari experience across forest and natural villu wetlands.', image: wildlife, season: 'February - October', x: 36, y: 29, stayBase: 'Wilpattu' },
  { name: 'Sigiriya Rock Fortress', category: 'Culture', group: 'Ancient kingdom', bestFor: 'History and iconic views', description: 'Climb the UNESCO rock citadel and discover frescoes and royal water gardens.', image: sigiriya, season: 'January - April', x: 56, y: 40, stayBase: 'Sigiriya' },
  { name: 'Temple of the Tooth', category: 'Culture', group: 'Sacred heritage', bestFor: 'Buddhist culture', description: 'Sri Lanka’s revered temple beside Kandy Lake, rich in ceremony and art.', image: kandy, season: 'Year-round', x: 48, y: 51, stayBase: 'Kandy' },
  { name: 'Galle Fort', category: 'Culture', group: 'Colonial heritage', bestFor: 'Architecture and walking tours', description: 'UNESCO fort streets, museums, cafes and sunset walks along historic ramparts.', image: galle, season: 'November - April', x: 38, y: 88, stayBase: 'Galle' },
  { name: 'Jaffna Heritage', category: 'Culture', group: 'Northern traditions', bestFor: 'Tamil culture and cuisine', description: 'Colourful temples, historic forts, island communities and distinctive food.', image: jaffna, season: 'January - September', x: 46, y: 9, stayBase: 'Jaffna' },
  { name: 'Polonnaruwa Ancient City', category: 'Culture', group: 'Ancient city', bestFor: 'Ruins and cycling', description: 'Explore royal palaces, stupas and remarkable stone carvings by bicycle.', image: sigiriya, season: 'January - September', x: 64, y: 41, stayBase: 'Polonnaruwa' }
  ,{ name: 'Bentota Beach', category: 'Beaches', group: 'Water sports', bestFor: 'Resorts and river adventures', description: 'A broad southwest beach with water sports, river safaris and resort stays.', image: galle, season: 'November - April', x: 34, y: 79, stayBase: 'Bentota' }
  ,{ name: 'Negombo Beach', category: 'Beaches', group: 'West coast', bestFor: 'First or final beach stay', description: 'A convenient coastal town near the airport with lagoon life and seafood.', image: mirissa, season: 'November - April', x: 31, y: 57, stayBase: 'Negombo' }
  ,{ name: 'Nilaveli Beach', category: 'Beaches', group: 'White sand', bestFor: 'Calm sea and island trips', description: 'A long east-coast beach and gateway to Pigeon Island.', image: mirissa, season: 'May - September', x: 74, y: 24, stayBase: 'Trincomalee' }
  ,{ name: 'Pasikudah Beach', category: 'Beaches', group: 'Shallow bay', bestFor: 'Families and calm swimming', description: 'A famously shallow bay with warm water and relaxed resort experiences.', image: mirissa, season: 'May - September', x: 78, y: 43, stayBase: 'Pasikudah' }
  ,{ name: 'Tangalle Beach', category: 'Beaches', group: 'Quiet coast', bestFor: 'Secluded tropical beaches', description: 'A scenic southern coastline with coves, palms and peaceful boutique stays.', image: mirissa, season: 'November - April', x: 58, y: 91, stayBase: 'Tangalle' }
  ,{ name: 'Kalpitiya Beach', category: 'Beaches', group: 'Kitesurfing', bestFor: 'Wind sports and lagoons', description: 'A peninsula known for kitesurfing, lagoons and seasonal dolphin trips.', image: mirissa, season: 'May - October', x: 29, y: 37, stayBase: 'Kalpitiya' }
  ,{ name: 'Weligama Bay', category: 'Beaches', group: 'Beginner surfing', bestFor: 'Surf lessons', description: 'A wide sandy bay with gentle waves, surf schools and coastal cafes.', image: mirissa, season: 'November - April', x: 46, y: 90, stayBase: 'Weligama' }
  ,{ name: 'Uppuveli Beach', category: 'Beaches', group: 'East coast', bestFor: 'Swimming and relaxation', description: 'A relaxed Trincomalee beach with warm water and local restaurants.', image: mirissa, season: 'May - September', x: 73, y: 27, stayBase: 'Trincomalee' }
  ,{ name: 'Adam’s Peak', category: 'Nature', group: 'Sacred mountain', bestFor: 'Sunrise pilgrimage hike', description: 'A celebrated overnight climb to a sacred summit and sunrise viewpoint.', image: ella, season: 'December - May', x: 43, y: 64, stayBase: 'Nallathanniya' }
  ,{ name: 'Knuckles Mountain Range', category: 'Nature', group: 'Mountain trekking', bestFor: 'Guided hikes and villages', description: 'Rugged peaks, cloud forest and remote trails in the central highlands.', image: rainforest, season: 'January - March', x: 53, y: 49, stayBase: 'Kandy' }
  ,{ name: 'Hakgala Botanical Garden', category: 'Nature', group: 'Botanical garden', bestFor: 'Flowers and cool gardens', description: 'A highland garden near Nuwara Eliya with roses, ferns and mountain views.', image: nuwaraEliya, season: 'March - May', x: 52, y: 62, stayBase: 'Nuwara Eliya' }
  ,{ name: 'Bambarakanda Falls', category: 'Nature', group: 'Waterfall', bestFor: 'Scenery and short hikes', description: 'Sri Lanka’s tallest waterfall, descending through pine-covered highlands.', image: ella, season: 'March - May', x: 49, y: 69, stayBase: 'Haputale' }
  ,{ name: 'Dunhinda Falls', category: 'Nature', group: 'Waterfall', bestFor: 'Forest waterfall walk', description: 'A dramatic misty waterfall reached by a scenic trail near Badulla.', image: ella, season: 'June - July', x: 61, y: 62, stayBase: 'Badulla' }
  ,{ name: 'Ravana Falls', category: 'Nature', group: 'Roadside waterfall', bestFor: 'Ella excursions', description: 'A popular cascading waterfall set among the hills south of Ella.', image: ella, season: 'Year-round', x: 60, y: 69, stayBase: 'Ella' }
  ,{ name: 'Kitulgala', category: 'Nature', group: 'River adventure', bestFor: 'Rafting and rainforest', description: 'A rainforest town known for white-water rafting and outdoor adventures.', image: rainforest, season: 'January - April', x: 42, y: 58, stayBase: 'Kitulgala' }
  ,{ name: 'Meemure Village', category: 'Nature', group: 'Remote village', bestFor: 'Authentic village trekking', description: 'A secluded traditional village surrounded by the Knuckles mountains.', image: rainforest, season: 'January - September', x: 57, y: 49, stayBase: 'Knuckles' }
  ,{ name: 'Kumana National Park', category: 'Wildlife', group: 'Bird sanctuary', bestFor: 'Migratory birds', description: 'An eastern wetland wilderness famous for nesting and migratory birds.', image: wildlife, season: 'April - July', x: 80, y: 68, stayBase: 'Arugam Bay' }
  ,{ name: 'Bundala National Park', category: 'Wildlife', group: 'Wetland safari', bestFor: 'Birds and crocodiles', description: 'Coastal lagoons supporting flamingos, migratory birds and crocodiles.', image: wildlife, season: 'September - March', x: 64, y: 87, stayBase: 'Tissamaharama' }
  ,{ name: 'Wasgamuwa National Park', category: 'Wildlife', group: 'Elephant safari', bestFor: 'Quiet wilderness', description: 'A less-crowded park with elephants, riverine forest and abundant birdlife.', image: wildlife, season: 'November - May', x: 62, y: 47, stayBase: 'Wasgamuwa' }
  ,{ name: 'Kaudulla National Park', category: 'Wildlife', group: 'Elephant safari', bestFor: 'Seasonal elephant herds', description: 'A reservoir park offering excellent elephant sightings in the dry season.', image: wildlife, season: 'August - December', x: 61, y: 34, stayBase: 'Sigiriya' }
  ,{ name: 'Gal Oya National Park', category: 'Wildlife', group: 'Boat safari', bestFor: 'Elephants by the lake', description: 'A distinctive wilderness where wildlife can be viewed on reservoir boat safaris.', image: wildlife, season: 'March - July', x: 73, y: 59, stayBase: 'Gal Oya' }
  ,{ name: 'Pigeon Island', category: 'Wildlife', group: 'Marine park', bestFor: 'Snorkelling and reef life', description: 'A protected marine park off Nilaveli with coral, reef fish and turtles.', image: mirissa, season: 'May - September', x: 76, y: 23, stayBase: 'Trincomalee' }
  ,{ name: 'Rekawa Turtle Beach', category: 'Wildlife', group: 'Turtle watching', bestFor: 'Responsible night observation', description: 'A community-led conservation beach where sea turtles come ashore to nest.', image: mirissa, season: 'April - July', x: 59, y: 92, stayBase: 'Tangalle' }
  ,{ name: 'Kalpitiya Dolphin Watching', category: 'Wildlife', group: 'Marine wildlife', bestFor: 'Dolphin pods', description: 'Seasonal boat excursions known for large pods of spinner dolphins.', image: mirissa, season: 'November - March', x: 28, y: 35, stayBase: 'Kalpitiya' }
  ,{ name: 'Anuradhapura Sacred City', category: 'Culture', group: 'Ancient capital', bestFor: 'Stupas and Buddhist history', description: 'A vast sacred city of ancient stupas, monasteries and the revered Sri Maha Bodhi.', image: sigiriya, season: 'January - September', x: 44, y: 29, stayBase: 'Anuradhapura' }
  ,{ name: 'Dambulla Cave Temple', category: 'Culture', group: 'Cave temple', bestFor: 'Murals and Buddha statues', description: 'A UNESCO cave complex filled with historic paintings and sacred sculpture.', image: kandy, season: 'Year-round', x: 53, y: 43, stayBase: 'Sigiriya' }
  ,{ name: 'Mihintale', category: 'Culture', group: 'Sacred mountain', bestFor: 'Buddhist heritage and views', description: 'An ancient monastic hill regarded as the cradle of Buddhism in Sri Lanka.', image: sigiriya, season: 'January - September', x: 48, y: 29, stayBase: 'Anuradhapura' }
  ,{ name: 'Kataragama Sacred City', category: 'Culture', group: 'Pilgrimage', bestFor: 'Multi-faith traditions', description: 'A vibrant pilgrimage town sacred to Buddhist, Hindu and indigenous traditions.', image: kandy, season: 'July - August', x: 68, y: 79, stayBase: 'Kataragama' }
  ,{ name: 'Yapahuwa Rock Fortress', category: 'Culture', group: 'Medieval capital', bestFor: 'Stone architecture', description: 'A dramatic rock citadel with an ornate medieval staircase and panoramic views.', image: sigiriya, season: 'January - September', x: 43, y: 40, stayBase: 'Kurunegala' }
  ,{ name: 'Colombo City', category: 'Culture', group: 'Modern city', bestFor: 'Markets, museums and food', description: 'Explore Pettah, colonial landmarks, temples, galleries and contemporary dining.', image: galle, season: 'Year-round', x: 31, y: 66, stayBase: 'Colombo' }
  ,{ name: 'Kelaniya Raja Maha Vihara', category: 'Culture', group: 'Historic temple', bestFor: 'Murals and Buddhist worship', description: 'An important temple near Colombo celebrated for its paintings and ceremonies.', image: kandy, season: 'Year-round', x: 34, y: 63, stayBase: 'Colombo' }
  ,{ name: 'Delft Island', category: 'Culture', group: 'Island heritage', bestFor: 'Wild horses and northern history', description: 'A remote limestone island with wild horses, old fort ruins and distinctive culture.', image: jaffna, season: 'January - September', x: 34, y: 8, stayBase: 'Jaffna' }
];

const themes = {
  Beaches: { icon: Waves, color: '#38bdf8', heading: 'Beaches and coastal escapes' },
  Nature: { icon: Trees, color: '#34d399', heading: 'Mountains, waterfalls and forests' },
  Wildlife: { icon: PawPrint, color: '#fbbf24', heading: 'Sri Lanka wildlife experiences' },
  Culture: { icon: Landmark, color: '#e879f9', heading: 'Culture and living heritage' }
} as const;

const coordinates: Record<string, [number, number]> = {
  'Arugam Bay': [6.8404, 81.8368], 'Hikkaduwa Beach': [6.1395, 80.1063],
  'Mirissa Beach': [5.9483, 80.4716], 'Marble Beach': [8.5464, 81.1820],
  'Unawatuna Beach': [6.0105, 80.2497], Ella: [6.8667, 81.0466],
  'Nuwara Eliya': [6.9497, 80.7891], 'Diyaluma Falls': [6.7330, 81.0310],
  'Sinharaja Rainforest': [6.4027, 80.4173], 'Horton Plains': [6.8094, 80.8024],
  'Yala National Park': [6.3725, 81.5185], 'Udawalawe National Park': [6.4746, 80.8987],
  'Mirissa Whale Watching': [5.9429, 80.4595], 'Minneriya National Park': [8.0369, 80.9036],
  'Wilpattu National Park': [8.4582, 80.0047], 'Sigiriya Rock Fortress': [7.9570, 80.7603],
  'Temple of the Tooth': [7.2936, 80.6413], 'Galle Fort': [6.0260, 80.2170],
  'Jaffna Heritage': [9.6615, 80.0255], 'Polonnaruwa Ancient City': [7.9403, 81.0188]
  ,'Bentota Beach': [6.4214, 80.0003], 'Negombo Beach': [7.2381, 79.8403]
  ,'Nilaveli Beach': [8.6833, 81.2000], 'Pasikudah Beach': [7.9291, 81.5612]
  ,'Tangalle Beach': [6.0243, 80.7941], 'Kalpitiya Beach': [8.2295, 79.7596]
  ,'Weligama Bay': [5.9739, 80.4290], 'Uppuveli Beach': [8.6074, 81.2197]
  ,'Adam’s Peak': [6.8096, 80.4994], 'Knuckles Mountain Range': [7.4498, 80.8028]
  ,'Hakgala Botanical Garden': [6.9261, 80.8213], 'Bambarakanda Falls': [6.7733, 80.8312]
  ,'Dunhinda Falls': [7.0170, 81.0630], 'Ravana Falls': [6.8412, 81.0546]
  ,Kitulgala: [6.9895, 80.4271], 'Meemure Village': [7.4333, 80.8333]
  ,'Kumana National Park': [6.6000, 81.7167], 'Bundala National Park': [6.1994, 81.2107]
  ,'Wasgamuwa National Park': [7.7167, 80.9333], 'Kaudulla National Park': [8.1616, 80.9037]
  ,'Gal Oya National Park': [7.2167, 81.3667], 'Pigeon Island': [8.7216, 81.2037]
  ,'Rekawa Turtle Beach': [6.0477, 80.8455], 'Kalpitiya Dolphin Watching': [8.2295, 79.7596]
  ,'Anuradhapura Sacred City': [8.3114, 80.4037], 'Dambulla Cave Temple': [7.8567, 80.6492]
  ,Mihintale: [8.3500, 80.5167], 'Kataragama Sacred City': [6.4135, 81.3346]
  ,'Yapahuwa Rock Fortress': [7.8167, 80.3167], 'Colombo City': [6.9271, 79.8612]
  ,'Kelaniya Raja Maha Vihara': [6.9553, 79.9220], 'Delft Island': [9.5167, 79.6833]
};

const tileUrl = import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const beachPhotos: Record<string, { url: string; source: string }> = {
  'Arugam Bay': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Arugam%20bay%20beach.jpg?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Arugam_bay_beach.jpg' },
  'Hikkaduwa Beach': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hikkaduwa%20beach%20Sri%20Lanka.jpg?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Hikkaduwa_beach_Sri_Lanka.jpg' },
  'Mirissa Beach': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mirissa%20Beach%20Sri%20Lanka.jpg?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Mirissa_Beach_Sri_Lanka.jpg' },
  'Marble Beach': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Marble%20beach%20Trincomalee.jpg?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Marble_beach_Trincomalee.jpg' },
  'Unawatuna Beach': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Unawatuna%20beach%20sri%20lanka.jpg?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Unawatuna_beach_sri_lanka.jpg' },
  'Bentota Beach': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bentota%20Beach%20-%20panoramio.jpg?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Bentota_Beach_-_panoramio.jpg' },
  'Negombo Beach': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Negombo%20Beach.jpg?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Negombo_Beach.jpg' },
  'Nilaveli Beach': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Nilaveli%20Beach%20Sri%20Lanka.jpg?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Nilaveli_Beach_Sri_Lanka.jpg' },
  'Pasikudah Beach': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Pasikudah%20beach.JPG?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Pasikudah_beach.JPG' },
  'Tangalle Beach': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/TangalleBeach.JPG?width=1200', source: 'https://commons.wikimedia.org/wiki/File:TangalleBeach.JPG' },
  'Kalpitiya Beach': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kalpitiya%20Beach.jpg?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Kalpitiya_Beach.jpg' },
  'Weligama Bay': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Welligama%20Beach%20Sri%20Lanka.jpg?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Welligama_Beach_Sri_Lanka.jpg' },
  'Uppuveli Beach': { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Uppveli%20Beach%20in%20Trincomalee%2C%20Sri%20Lanka.jpg?width=1200', source: 'https://commons.wikimedia.org/wiki/File:Uppveli_Beach_in_Trincomalee,_Sri_Lanka.jpg' }
};

const wikipediaTitles: Record<string, string> = {
  Ella: 'Ella, Sri Lanka', 'Diyaluma Falls': 'Diyaluma Falls', 'Sinharaja Rainforest': 'Sinharaja Forest Reserve',
  'Horton Plains': 'Horton Plains National Park', 'Adam’s Peak': "Adam's Peak", 'Meemure Village': 'Meemure',
  'Yala National Park': 'Yala National Park', 'Udawalawe National Park': 'Udawalawe National Park',
  'Mirissa Whale Watching': 'Mirissa', 'Minneriya National Park': 'Minneriya National Park',
  'Wilpattu National Park': 'Wilpattu National Park', 'Kumana National Park': 'Kumana National Park',
  'Pigeon Island': 'Pigeon Island National Park', 'Rekawa Turtle Beach': 'Rekawa Lagoon',
  'Kalpitiya Dolphin Watching': 'Kalpitiya', 'Sigiriya Rock Fortress': 'Sigiriya',
  'Temple of the Tooth': 'Temple of the Tooth', 'Galle Fort': 'Galle Fort', 'Jaffna Heritage': 'Jaffna',
  'Polonnaruwa Ancient City': 'Polonnaruwa', 'Anuradhapura Sacred City': 'Anuradhapura',
  'Dambulla Cave Temple': 'Dambulla cave temple', 'Kataragama Sacred City': 'Kataragama temple',
  'Colombo City': 'Colombo', 'Kelaniya Raja Maha Vihara': 'Kelaniya Raja Maha Vihara', 'Delft Island': 'Delft Island'
};

type OnlinePhoto = { url: string; source: string };
const photoCache = new Map<string, OnlinePhoto>();

type Props = { activeInterests: string[]; selected: string[]; onToggle: (name: string) => void; onCategoryChange: (category: Category) => void };

export default function SriLankaDestinationMap({ activeInterests, selected, onToggle, onCategoryChange }: Props) {
  const activeCategory = (activeInterests[0] || 'Beaches') as Category;
  const visible = useMemo(() => attractions.filter(place => place.category === activeCategory), [activeCategory]);
  const [focusedName, setFocusedName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [wikiPhoto, setWikiPhoto] = useState<OnlinePhoto | null>(null);
  const focused = attractions.find(place => place.name === focusedName && place.category === activeCategory) || visible[0];
  const onlinePhoto = beachPhotos[focused.name];
  const displayPhoto = onlinePhoto || wikiPhoto;
  const ThemeIcon = themes[activeCategory].icon;
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2) return [];
    return attractions.filter(place => `${place.name} ${place.category} ${place.group} ${place.bestFor} ${place.description} ${place.stayBase}`.toLowerCase().includes(query)).slice(0, 8);
  }, [searchQuery]);

  const exploreSearchResult = (place: Attraction) => {
    onCategoryChange(place.category);
    setFocusedName(place.name);
    setSearchQuery('');
  };

  useEffect(() => {
    if (onlinePhoto) { setWikiPhoto(null); return; }
    const cached = photoCache.get(focused.name);
    if (cached) { setWikiPhoto(cached); return; }

    const controller = new AbortController();
    setWikiPhoto(null);
    const title = wikipediaTitles[focused.name] || focused.name;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('No Wikimedia image')))
      .then(data => {
        const url = data.originalimage?.source || data.thumbnail?.source;
        if (!url) return;
        const photo = { url, source: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}` };
        photoCache.set(focused.name, photo);
        setWikiPhoto(photo);
      })
      .catch(error => { if (error.name !== 'AbortError') setWikiPhoto(null); });
    return () => controller.abort();
  }, [focused.name, onlinePhoto]);

  return <div className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
    <div className="border-b border-white/10 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start"><div className="flex items-start gap-4"><span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950"><ThemeIcon size={24} /></span><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Interactive destination explorer</p><h3 className="mt-1 text-2xl font-bold">{themes[activeCategory].heading}</h3><p className="mt-2 text-sm text-slate-300">Click a map pin to explore the place, then add it to your personalized journey.</p></div></div>
        <div className="relative w-full lg:max-w-md"><Search className="absolute left-4 top-3.5 text-slate-400" size={19} /><input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search Ella, surfing, waterfalls..." className="w-full rounded-xl border border-white/15 bg-slate-900/90 py-3 pl-11 pr-10 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" />{searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-white"><X size={20} /></button>}
          {searchQuery.trim().length >= 2 && <div className="absolute right-0 top-[54px] z-[1000] max-h-96 w-full overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl">{searchResults.length ? searchResults.map(place => <div key={place.name} className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/10"><button type="button" onClick={() => exploreSearchResult(place)} className="flex min-w-0 flex-1 items-center gap-3 text-left"><img src={beachPhotos[place.name]?.url || place.image} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = place.image; }} alt="" className="h-12 w-14 flex-shrink-0 rounded-lg object-cover" referrerPolicy="no-referrer" /><span className="min-w-0"><span className="block truncate text-sm font-bold text-white">{place.name}</span><span className="block truncate text-xs text-slate-400">{place.category} · {place.group}</span></span></button><button type="button" title={selected.includes(place.name) ? 'Remove from journey' : 'Add to journey'} onClick={() => onToggle(place.name)} className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${selected.includes(place.name) ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-white hover:bg-cyan-400 hover:text-slate-950'}`}>{selected.includes(place.name) ? <Check size={17} /> : <Plus size={17} />}</button></div>) : <p className="p-5 text-center text-sm text-slate-400">No destinations found. Try a place or activity.</p>}</div>}
        </div>
      </div>
    </div>
    <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative min-h-[570px] overflow-hidden border-b border-white/10 bg-slate-900 p-4 lg:border-b-0 lg:border-r">
        <MapContainer center={[7.8731, 80.7718]} zoom={7} minZoom={7} maxZoom={14} maxBounds={[[5.5, 79.2], [10.2, 82.4]]} scrollWheelZoom className="h-[538px] w-full rounded-2xl" aria-label="Interactive OpenStreetMap of Sri Lanka">
          <TileLayer url={tileUrl} attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          {visible.map(place => { const chosen = selected.includes(place.name); const current = focused.name === place.name; return <CircleMarker key={place.name} center={coordinates[place.name]} radius={chosen ? 12 : current ? 10 : 8} pathOptions={{ color: '#ffffff', weight: 3, fillColor: chosen ? '#06b6d4' : themes[place.category].color, fillOpacity: 1 }} eventHandlers={{ click: () => setFocusedName(place.name) }}><Tooltip direction="top" offset={[0, -8]} opacity={1}><strong>{place.name}</strong><br />{place.group}</Tooltip></CircleMarker> })}
        </MapContainer>
        <div className="pointer-events-none absolute bottom-7 left-7 z-[500] rounded-xl border border-white/10 bg-slate-950/85 p-3 text-xs text-slate-200 shadow-xl backdrop-blur"><div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: themes[activeCategory].color }} /> Click a location</div><div className="mt-2 flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-cyan-500 ring-2 ring-white" /> Added to journey</div></div>
      </div>
      <div className="p-5 md:p-8">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900"><div className="relative h-56"><img key={`${focused.name}-${displayPhoto?.url || 'local'}`} src={displayPhoto?.url || focused.image} onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = focused.image; }} alt={focused.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" /><span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold backdrop-blur">Best for {focused.group}</span><h4 className="absolute bottom-4 left-4 text-2xl font-bold">{focused.name}</h4>{displayPhoto && <a href={displayPhoto.source} target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 rounded bg-black/60 px-2 py-1 text-[10px] text-white/80 hover:text-white">Photo: Wikimedia</a>}</div><div className="p-5"><p className="font-semibold text-cyan-300">{focused.bestFor}</p><p className="mt-3 text-sm leading-6 text-slate-300">{focused.description}</p><div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-xs"><span className="text-slate-500">Recommended stay base</span><span className="font-semibold text-white">{focused.stayBase}</span></div><div className="mt-2 flex justify-between text-xs"><span className="text-slate-500">Best season</span><span className="font-semibold text-white">{focused.season}</span></div><button type="button" onClick={() => onToggle(focused.name)} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold transition ${selected.includes(focused.name) ? 'bg-white text-slate-900' : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'}`}>{selected.includes(focused.name) ? <><Check size={18} /> Added to my journey</> : <><Plus size={18} /> Add to my journey</>}</button></div></div>
        <div className="mt-5 grid grid-cols-2 gap-2">{visible.map(place => <button key={place.name} type="button" onClick={() => setFocusedName(place.name)} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition ${focused.name === place.name ? 'border-cyan-300 bg-cyan-400/10 text-cyan-200' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}><MapPin size={14} className="flex-shrink-0" />{place.name}</button>)}</div>
      </div>
    </div>
    {selected.length > 0 && <div className="border-t border-white/10 bg-cyan-400/10 p-5 md:px-8"><div className="flex flex-wrap items-center gap-2"><span className="mr-2 text-xs font-bold uppercase tracking-wider text-cyan-200">Selected route ({selected.length})</span>{selected.map((name, index) => <button key={name} type="button" onClick={() => onToggle(name)} className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow"><span className="text-cyan-600">{index + 1}</span>{name}<X size={13} /></button>)}</div></div>}
  </div>;
}
