const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '94741105548';

const cleanText = value => String(value ?? '').trim();

const getPackages = async () => {
  if (mongoose.connection.readyState !== 1) return [];
  return mongoose.connection.db
    .collection('packages')
    .find({}, { projection: { name: 1, description: 1, duration: 1, places: 1, price: 1, image: 1 } })
    .limit(30)
    .toArray();
};

const numericPrice = price => {
  const match = String(price ?? '').replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
};

const queryAliases = {
  sigiriye: 'sigiriya', seegiriya: 'sigiriya', 'සීගිරිය': 'sigiriya',
  kandyye: 'kandy', nuwaraeliya: 'nuwara eliya', nuwareliya: 'nuwara eliya',
  galle: 'galle', yala: 'yala', udawalawa: 'udawalawe', udawalawe: 'udawalawe',
  anuradapura: 'anuradhapura', polonnaruwa: 'polonnaruwa', trinco: 'trincomalee'
};

const normalizeQuery = value => {
  let normalized = cleanText(value).toLowerCase().normalize('NFKC');
  Object.entries(queryAliases).forEach(([alias, destination]) => {
    normalized = normalized.replace(new RegExp(`\\b${alias}\\b`, 'giu'), destination);
  });
  return normalized;
};

const packageView = item => ({
  id: String(item._id),
  name: item.name || 'Sri Lanka Tour',
  description: item.description || '',
  duration: item.duration || '',
  places: item.places || '',
  price: item.price || 'Contact us',
  image: item.image || ''
});

const findRelevantPackages = (packages, text, budget) => {
  const normalizedText = normalizeQuery(text);
  const terms = normalizedText.split(/[^\p{L}\p{N}]+/u).filter(term => term.length > 2);
  const maxBudget = Number(budget) > 0 ? Number(budget) : Number.POSITIVE_INFINITY;
  const isBudgetSearch = Number.isFinite(maxBudget) || /under|below|less than|budget|cheap|\$/i.test(normalizedText);

  return packages
    .map(item => {
      const haystack = `${item.name} ${item.description} ${item.places}`.toLowerCase();
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { item, score };
    })
    .filter(({ item, score }) => numericPrice(item.price) <= maxBudget && (score > 0 || isBudgetSearch))
    .sort((a, b) => b.score - a.score || numericPrice(a.item.price) - numericPrice(b.item.price))
    .slice(0, 3)
    .map(({ item }) => packageView(item));
};

const extractOpenAIResponseText = data => {
  if (typeof data.output_text === 'string') return data.output_text;
  return (data.output || [])
    .flatMap(item => item.content || [])
    .filter(item => item.type === 'output_text')
    .map(item => item.text)
    .join('');
};

const requestGemini = async ({ instructions, input }) => {
  if (!process.env.GEMINI_API_KEY) return null;

  const model = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      headers: {
        'x-goog-api-key': process.env.GEMINI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: instructions }] },
        contents: [{ role: 'user', parts: [{ text: input }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 2048,
          responseSchema: {
            type: 'OBJECT',
            required: ['reply', 'language', 'recommendations', 'needsHuman', 'bookingDetails', 'nextQuestion'],
            properties: {
              reply: { type: 'STRING' },
              language: { type: 'STRING' },
              recommendations: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    id: { type: 'STRING' }, name: { type: 'STRING' }, description: { type: 'STRING' },
                    duration: { type: 'STRING' }, places: { type: 'STRING' }, price: { type: 'STRING' }, image: { type: 'STRING' }
                  }
                }
              },
              needsHuman: { type: 'BOOLEAN' },
              bookingDetails: {
                type: 'OBJECT',
                properties: {
                  name: { type: 'STRING' }, phone: { type: 'STRING' }, travelDate: { type: 'STRING' }, travellers: { type: 'INTEGER' },
                  destination: { type: 'STRING' }, package: { type: 'STRING' }
                }
              },
              nextQuestion: { type: 'STRING' },
              requestedField: { type: 'STRING', nullable: true }
            }
          }
        }
      }),
      signal: AbortSignal.timeout(30000)
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody?.error?.message || `Gemini request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const text = (data.candidates || [])
    .flatMap(candidate => candidate.content?.parts || [])
    .map(part => part.text || '')
    .join('');
  if (!text) throw new Error('Gemini returned an empty response.');
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error('Gemini returned invalid JSON.');
  }
};

const requestOpenAI = async ({ instructions, input }) => {
  if (!process.env.OPENAI_API_KEY) return null;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5.4-mini',
      instructions,
      input,
      text: { format: { type: 'json_object' } }
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!response.ok) {
    const requestId = response.headers.get('x-request-id');
    const error = new Error(`OpenAI request failed (${response.status})`);
    error.requestId = requestId;
    throw error;
  }

  const text = extractOpenAIResponseText(await response.json());
  return JSON.parse(text);
};

const requestAI = async payload => {
  if (process.env.GEMINI_API_KEY) {
    let lastError;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await requestGemini(payload);
      } catch (error) {
        lastError = error;
        if (error.status && error.status < 500 && error.status !== 429) throw error;
      }
    }
    throw lastError;
  }
  return requestOpenAI(payload);
};

const stayBases = {
  'Hikkaduwa Beach': 'Hikkaduwa', 'Mirissa Beach': 'Mirissa', 'Marble Beach': 'Trincomalee',
  'Unawatuna Beach': 'Galle', 'Diyaluma Falls': 'Ella', 'Horton Plains': 'Nuwara Eliya',
  'Mirissa Whale Watching': 'Mirissa', 'Minneriya National Park': 'Sigiriya',
  'Sigiriya Rock Fortress': 'Sigiriya', 'Temple of the Tooth': 'Kandy',
  'Galle Fort': 'Galle', 'Jaffna Heritage': 'Jaffna', 'Polonnaruwa Ancient City': 'Polonnaruwa',
  'Yala National Park': 'Yala', 'Udawalawe National Park': 'Udawalawe',
  'Wilpattu National Park': 'Wilpattu', 'Sinharaja Rainforest': 'Sinharaja'
  , 'Bentota Beach': 'Bentota', 'Negombo Beach': 'Negombo', 'Nilaveli Beach': 'Trincomalee'
  , 'Pasikudah Beach': 'Pasikudah', 'Tangalle Beach': 'Tangalle', 'Kalpitiya Beach': 'Kalpitiya'
  , 'Weligama Bay': 'Weligama', 'Uppuveli Beach': 'Trincomalee', 'Adam’s Peak': 'Nallathanniya'
  , 'Knuckles Mountain Range': 'Kandy', 'Hakgala Botanical Garden': 'Nuwara Eliya'
  , 'Bambarakanda Falls': 'Haputale', 'Dunhinda Falls': 'Badulla', 'Ravana Falls': 'Ella'
  , 'Meemure Village': 'Knuckles', 'Kumana National Park': 'Arugam Bay'
  , 'Bundala National Park': 'Tissamaharama', 'Kaudulla National Park': 'Sigiriya'
  , 'Pigeon Island': 'Trincomalee', 'Rekawa Turtle Beach': 'Tangalle'
  , 'Kalpitiya Dolphin Watching': 'Kalpitiya', 'Anuradhapura Sacred City': 'Anuradhapura'
  , 'Dambulla Cave Temple': 'Sigiriya', Mihintale: 'Anuradhapura'
  , 'Kataragama Sacred City': 'Kataragama', 'Yapahuwa Rock Fortress': 'Kurunegala'
  , 'Colombo City': 'Colombo', 'Kelaniya Raja Maha Vihara': 'Colombo', 'Delft Island': 'Jaffna'
};

const buildStayPlan = details => {
  const selected = Array.isArray(details.selectedDestinations) ? details.selectedDestinations.map(cleanText).filter(Boolean) : [];
  const bases = [...new Set(selected.map(place => stayBases[place] || place))];
  if (!bases.length) return [];
  const start = new Date(`${details.startDate}T00:00:00`);
  const end = new Date(`${details.endDate}T00:00:00`);
  const totalNights = Math.max(Math.round((end - start) / 86400000), 0);
  return bases.slice(0, Math.max(totalNights, 1)).map((location, index, includedBases) => ({
    location,
    nights: totalNights ? Math.floor(totalNights / includedBases.length) + (index < totalNights % includedBases.length ? 1 : 0) : 0,
    selectedPlaces: selected.filter(place => (stayBases[place] || place) === location)
  })).filter(stay => stay.nights > 0);
};

const fallbackItinerary = (details, recommendations) => {
  const start = cleanText(details.startingLocation) || 'Bandaranaike International Airport';
  const selectedPlaces = Array.isArray(details.selectedDestinations) ? details.selectedDestinations.map(cleanText).filter(Boolean) : [];
  const packagePlaces = recommendations.flatMap(item => String(item.places).split(/,|–|-/)).map(cleanText).filter(Boolean);
  const places = [...new Set([...selectedPlaces, ...packagePlaces])];
  const startDate = details.startDate ? new Date(`${details.startDate}T00:00:00`) : new Date();
  const endDate = details.endDate ? new Date(`${details.endDate}T00:00:00`) : startDate;
  const requestedDays = Math.floor((endDate - startDate) / 86400000) + 1;
  const days = Math.min(Math.max(Number.isFinite(requestedDays) ? requestedDays : 3, 1), 10);
  const stays = buildStayPlan(details);

  return {
    title: 'Your Sri Lanka Journey',
    summary: `A ${days}-day journey for ${details.travellers || 1} traveller(s), starting from ${start}.`,
    estimatedCost: details.budget ? `$${Math.round(Number(details.budget) * 0.9)} - $${details.budget}` : 'Contact us for a quotation',
    recommendedPackage: recommendations[0] || null,
    stays,
    days: Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      title: index === 0 ? `${start} → ${places[0] || 'Colombo'}` : places[index] || places[index % Math.max(places.length, 1)] || 'Sri Lanka Highlights',
      activities: index === 0
        ? ['Airport or hotel pickup', 'Private transfer', 'Hotel check-in and welcome briefing']
        : ['Guided sightseeing', 'Local cultural experience', 'Leisure time'],
      overnight: places[index] || places[0] || 'Colombo'
    })),
    note: 'This is an initial plan. Confirm availability and the final quotation with Lucky Travel.'
  };
};

const activityCatalog = [
  { activity: 'Surf lesson', locations: ['Weligama Bay', 'Arugam Bay', 'Hikkaduwa Beach'], type: 'Surfing', duration: '2-3 hours', bestTime: 'Morning' },
  { activity: 'Scuba diving', locations: ['Hikkaduwa Beach', 'Nilaveli Beach', 'Unawatuna Beach'], type: 'Diving', duration: 'Half day', bestTime: 'Morning' },
  { activity: 'Snorkelling', locations: ['Pigeon Island', 'Hikkaduwa Beach', 'Pasikudah Beach'], type: 'Diving', duration: '2-3 hours', bestTime: 'Morning' },
  { activity: 'White-water rafting', locations: ['Kitulgala'], type: 'Adventure', duration: 'Half day', bestTime: 'Morning' },
  { activity: 'Sunrise mountain hike', locations: ['Adam’s Peak', 'Ella', 'Horton Plains'], type: 'Hiking', duration: '4-7 hours', bestTime: 'Before sunrise' },
  { activity: 'Waterfall hike and swim', locations: ['Diyaluma Falls', 'Bambarakanda Falls', 'Dunhinda Falls'], type: 'Hiking', duration: 'Half day', bestTime: 'Morning' },
  { activity: 'Wildlife jeep safari', locations: ['Yala National Park', 'Udawalawe National Park', 'Wilpattu National Park', 'Minneriya National Park'], type: 'Wildlife', duration: 'Half day', bestTime: 'Early morning or afternoon' },
  { activity: 'Whale and dolphin watching', locations: ['Mirissa Whale Watching', 'Kalpitiya Dolphin Watching'], type: 'Wildlife', duration: 'Half day', bestTime: 'Early morning' },
  { activity: 'Birdwatching tour', locations: ['Kumana National Park', 'Bundala National Park', 'Sinharaja Rainforest'], type: 'Wildlife', duration: 'Half day', bestTime: 'Early morning' },
  { activity: 'Tea estate experience', locations: ['Nuwara Eliya', 'Ella', 'Haputale'], type: 'Culture', duration: '2-4 hours', bestTime: 'Morning' },
  { activity: 'Ancient city cycling', locations: ['Polonnaruwa Ancient City', 'Anuradhapura Sacred City'], type: 'Cycling', duration: 'Half day', bestTime: 'Morning or late afternoon' },
  { activity: 'Sri Lankan cooking class', locations: ['Galle Fort', 'Ella', 'Kandy', 'Colombo City'], type: 'Food', duration: '3-4 hours', bestTime: 'Lunch or dinner' },
  { activity: 'Street-food walk', locations: ['Colombo City', 'Galle Fort', 'Jaffna Heritage'], type: 'Food', duration: '2-3 hours', bestTime: 'Evening' },
  { activity: 'Ayurveda and spa session', locations: ['Bentota Beach', 'Negombo Beach', 'Kandy', 'Unawatuna Beach'], type: 'Wellness', duration: '2-3 hours', bestTime: 'Afternoon' },
  { activity: 'Village and local life tour', locations: ['Sigiriya Rock Fortress', 'Meemure Village', 'Jaffna Heritage'], type: 'Culture', duration: 'Half day', bestTime: 'Morning' },
  { activity: 'Scenic train journey', locations: ['Kandy', 'Nuwara Eliya', 'Ella'], type: 'Scenic', duration: '3-7 hours', bestTime: 'Daytime' }
];

router.post('/activities', async (req, res) => {
  try {
    const details = req.body || {};
    const destinations = Array.isArray(details.selectedDestinations) ? details.selectedDestinations.map(cleanText).filter(Boolean) : [];
    const interests = Array.isArray(details.activityTypes) ? details.activityTypes.map(cleanText).filter(Boolean) : [];
    if (!interests.length) return res.status(400).json({ message: 'Select at least one activity type.' });

    const fallback = activityCatalog
      .map(item => ({ ...item, score: item.locations.some(location => destinations.some(destination => destination.includes(location) || location.includes(destination))) * 3 + interests.includes(item.type) * 2 }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ score, locations, ...item }) => ({ ...item, location: locations.find(location => destinations.some(destination => destination.includes(location) || location.includes(destination))) || locations[0], why: `Matches your ${item.type.toLowerCase()} interest and selected route.` }));

    let recommendations = null;
    let aiPowered = false;
    try {
      const answer = await requestAI({
        instructions: `You are Lucky Travel's specialist activity and destination recommender for foreign visitors to Sri Lanka. If destinations are supplied, prioritize realistic activities at or near them and also suggest useful nearby alternatives. If no destination is supplied, use the selected activity interests to recommend the best Sri Lankan locations where the traveller can do them. Prefer exact location names from the verified activity catalog so the website can add them to the map. Respect traveller style, trip dates and physical intensity. Clearly distinguish seasonal or weather-dependent activities and never claim confirmed availability. Return valid JSON only with one key: recommendations. recommendations must be an array of 5-8 objects with keys activity, location, type, why, duration, bestTime. Respond in ${details.language || 'English'}.`,
        input: JSON.stringify({ traveller: details, verifiedActivityCatalog: activityCatalog })
      });
      recommendations = Array.isArray(answer?.recommendations) ? answer.recommendations : null;
      aiPowered = Boolean(recommendations?.length);
    } catch (error) {
      console.error('AI activity finder fallback:', error.message);
    }

    res.json({ recommendations: recommendations?.length ? recommendations : fallback, aiPowered });
  } catch (error) {
    console.error('Activity finder error:', error);
    res.status(500).json({ message: 'Unable to recommend activities right now.' });
  }
});

router.post('/planner', async (req, res) => {
  try {
    const details = req.body || {};
    const required = ['budget', 'startDate', 'endDate', 'travellers', 'startingLocation'];
    const missing = required.filter(field => !cleanText(details[field]));
    if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });

    const packages = await getPackages();
    const interests = Array.isArray(details.interests) ? details.interests.join(' ') : cleanText(details.interests);
    const destinations = Array.isArray(details.selectedDestinations) ? details.selectedDestinations.join(' ') : '';
    const recommendations = findRelevantPackages(packages, `${interests} ${destinations}`, details.budget);
    const catalog = packages.map(packageView);

    let itinerary = null;
    let aiPowered = false;
    try {
      itinerary = await requestAI({
        instructions: `You are Lucky Travel's expert Sri Lanka route planner. Every customer-selected destination and selected activity must be included where practical and placed on a suitable day at its specified location. Optimize the route geographically from the starting location and fit it exactly into the supplied travel dates. Calculate total days inclusively and total nights as days minus one. Allocate those nights across sensible nearby stay bases (for example Galle Fort and Unawatuna can share Galle; Horton Plains can use Nuwara Eliya). Do not allocate more nights than the trip contains. Use only the supplied package catalog for package facts and prices. Return valid JSON only with keys: title, summary, estimatedCost, recommendedPackage, stays, days, note. stays must be an array of {location, nights, selectedPlaces}. days must contain exactly the trip's number of days and be an array of {day, title, activities, overnight}. Mention travel/transfer days realistically. Never claim confirmed availability. Keep within the customer's USD budget. Respond in ${details.language || 'English'}.`,
        input: JSON.stringify({ customer: details, packageCatalog: catalog })
      });
      if (itinerary && (!Array.isArray(itinerary.stays) || !itinerary.stays.length)) itinerary.stays = buildStayPlan(details);
      aiPowered = Boolean(itinerary);
    } catch (error) {
      console.error('AI planner fallback:', error.message, error.requestId || '');
    }

    res.json({ itinerary: itinerary || fallbackItinerary(details, recommendations), recommendations, aiPowered });
  } catch (error) {
    console.error('Travel planner error:', error);
    res.status(500).json({ message: 'Unable to create an itinerary right now.' });
  }
});

const fallbackChat = (message, packages, language) => {
  const budgetMatch = message.match(/(?:under|below|less than|budget|\$)\s*\$?\s*(\d+)/i);
  const recommendations = findRelevantPackages(packages, message, budgetMatch?.[1]);
  const wantsHuman = /human|agent|whatsapp|book|booking|reserve|මනුෂ්‍ය|වට්ස්ඇප්|மனித|முன்பதிவு/i.test(message);
  const primary = recommendations[0];
  if (primary && !budgetMatch) {
    const facts = [primary.duration, primary.price].filter(Boolean).join(' · ');
    const replies = {
      Sinhala: `ඔව්, ${primary.name} යන්න පුළුවන්. ${primary.description || 'මෙය ශ්‍රී ලංකාවේ ජනප්‍රිය සංචාරක අත්දැකීමක්.'}${facts ? ` Package විස්තර: ${facts}.` : ''} ඔබගේ travel date එක සහ travellers ගණන කිව්වොත් ගැළපෙන plan එකක් දෙන්නම්.`,
      Tamil: `ஆம், ${primary.name} செல்ல முடியும். ${primary.description || 'இது இலங்கையின் பிரபலமான பயண அனுபவமாகும்.'}${facts ? ` Package விவரம்: ${facts}.` : ''}`,
      English: `Yes, you can visit ${primary.name}. ${primary.description || 'It is a popular Sri Lankan travel experience.'}${facts ? ` Package details: ${facts}.` : ''} Tell me your travel date and number of travellers and I can help plan it.`
    };
    return {
      reply: replies[language] || replies.English,
      language,
      recommendations: [primary],
      needsHuman: wantsHuman,
      bookingDetails: {},
      nextQuestion: wantsHuman ? 'Please share your name, phone number, travel date, and number of travellers.' : ''
    };
  }
  const intros = {
    Sinhala: recommendations.length ? 'ඔබට ගැළපෙන packages කිහිපයක් මෙන්න.' : 'මේ මොහොතේ AI destination guide එකෙන් නිවැරදි විස්තර ලබාගැනීමට නොහැකි වුණා. කරුණාකර ස්ථානයේ නම සහ ඔබ ගමන ආරම්භ කරන නගරය සඳහන් කර නැවත අහන්න.',
    Tamil: recommendations.length ? 'உங்களுக்கு பொருத்தமான சில பயணத் தொகுப்புகள் இங்கே.' : 'தற்போது AI destination guide மூலம் சரியான தகவலைப் பெற முடியவில்லை. இடத்தின் பெயரையும் நீங்கள் புறப்படும் நகரத்தையும் குறிப்பிட்டு மீண்டும் கேளுங்கள்.',
    English: recommendations.length ? 'Here are the most relevant packages I found for you.' : 'I could not reach the AI destination guide just now. Please mention the place name and where you will start, then try again.'
  };

  return {
    reply: intros[language] || intros.English,
    language,
    recommendations,
    needsHuman: wantsHuman,
    bookingDetails: {},
    nextQuestion: wantsHuman ? 'Please share your name, phone number, travel date, and number of travellers.' : ''
  };
};

router.post('/chat', async (req, res) => {
  try {
    const message = cleanText(req.body?.message);
    const sessionId = cleanText(req.body?.sessionId);
    const language = ['Sinhala', 'Tamil', 'English'].includes(req.body?.language) ? req.body.language : 'English';
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-10) : [];
    if (!message) return res.status(400).json({ message: 'Message is required.' });

    const packages = await getPackages();
    const catalog = packages.map(packageView);
    const conversationText = [...history.map(item => cleanText(item.content)), message].join(' ');
    const catalogRequested = /package|packages|tour|tours|price|prices|cost|budget|below|under|book|booking|reserve|පැකේජ|ටුවර්|මිල|වියදම|වෙන්කර|බුක්|பேக்கேஜ்|சுற்றுலா|விலை|முன்பதிவு/i.test(conversationText);
    const destinationOnlyInstructions = `You are an expert multilingual Sri Lanka destination guide. Reply in ${language}. Understand English, Sinhala, Tamil, mixed-language messages, spelling variations and Romanized Sinhala. Answer questions about any real place, village, beach, mountain, forest, national park, temple, town, route or activity anywhere in Sri Lanka.

Answer the exact question directly in the first sentence. Give factual, practical information from your Sri Lanka travel knowledge. When relevant, cover how to get there from the user's starting point, approximate travel time and distance, main things to see and do, best season or time of day, recommended visit duration or nights, nearby places, suitable traveller types and one practical tip. If a name is genuinely ambiguous, ask for the district or nearest town. Explain that live weather, closures, transport schedules, ticket prices and availability should be confirmed because they can change.

Do not redirect the traveller to a different destination. Use the conversation history for follow-up questions. If the traveller asks to book, reserve or arrange a trip, put the exact destination they requested in bookingDetails.destination (for example "Arugam Bay"), preserve any name, phone, travelDate and travellers they supplied, and ask only for the next missing booking field. Never substitute a previously discussed recommendation for the traveller's newly requested destination. For ordinary destination questions, bookingDetails must be an empty object and do not ask for personal details.

Return valid JSON only with keys: reply, language, recommendations, needsHuman, bookingDetails, nextQuestion, requestedField. recommendations must always be an empty array. needsHuman must be false unless the user asks for an agent. requestedField must be null or one of name, phone, travelDate, travellers.`;
    let answer = null;
    let aiPowered = false;

    try {
      answer = await requestAI({
        instructions: destinationOnlyInstructions,
        input: JSON.stringify({ conversation: [...history, { role: 'user', content: message }] })
      });
      if (answer) {
        const budgetMatch = message.match(/(?:under|below|less than|budget|\$)\s*\$?\s*(\d+)/i);
        const relevant = findRelevantPackages(packages, message, budgetMatch?.[1]);
        const relevantIds = new Set(relevant.map(item => item.id));
        answer.recommendations = catalogRequested ? relevant.filter(item => relevantIds.has(item.id)).slice(0, 3) : [];
        if (catalogRequested && answer.recommendations.length) {
          const packageIntros = {
            Sinhala: 'ඔබගේ ඉල්ලීමට ගැළපෙන Lucky Travel packages මෙන්න.',
            Tamil: 'உங்கள் கோரிக்கைக்கு பொருத்தமான Lucky Travel packages இங்கே.',
            English: 'Here are the Lucky Travel packages that match your request.'
          };
          answer.reply = packageIntros[language] || packageIntros.English;
        }
      }
      aiPowered = Boolean(answer);
    } catch (error) {
      console.error('AI chat fallback:', error.message, error.requestId || '');
    }

    answer = answer || fallbackChat(message, packages, language);
    const bookingIntent = /book|booking|reserve|confirm|yes|ඔව්|වෙන්කර|බුක්|ஆம்|முன்பதிவு/i.test(message);
    let bookingSaved = false;
    let bookingId = null;
    let requestedField = answer.requestedField || null;

    if (sessionId && mongoose.connection.readyState === 1) {
      const collection = mongoose.connection.db.collection('chatbotBookings');
      const existing = await collection.findOne({ sessionId });
      const details = { ...(existing?.bookingDetails || {}), ...(answer.bookingDetails || {}) };
      const shouldSave = Boolean(existing || bookingIntent || answer.needsHuman || Object.keys(details).length);

      if (shouldSave) {
        const requestedDestination = cleanText(details.destination);
        const recommendedPackage = answer.recommendations?.[0]
          || (bookingIntent && requestedDestination ? null : existing?.recommendedPackage)
          || null;
        const hasRequiredDetails = Boolean(details.name && details.phone && details.travelDate && details.travellers);
        const now = new Date();
        const result = await collection.findOneAndUpdate(
          { sessionId },
          {
            $set: {
              language,
              bookingDetails: details,
              recommendedPackage,
              lastMessage: message,
              status: existing?.status || (hasRequiredDetails ? 'pending' : 'collecting'),
              updatedAt: now
            },
            $setOnInsert: { createdAt: now },
            $push: {
              messages: {
                $each: [
                  { role: 'user', content: message, createdAt: now },
                  { role: 'assistant', content: answer.reply, createdAt: now }
                ],
                $slice: -50
              }
            }
          },
          { upsert: true, returnDocument: 'after' }
        );
        bookingSaved = true;
        bookingId = String(result._id);

        const missingField = ['name', 'phone', 'travelDate', 'travellers'].find(field => !details[field]);
        if (missingField) {
          requestedField = missingField;
          const questions = {
            English: {
              name: 'What name should I use for the booking?',
              phone: 'What is your WhatsApp or phone number?',
              travelDate: 'Please select your preferred travel date.',
              travellers: 'How many travellers will be joining?'
            },
            Sinhala: {
              name: 'Booking එක සඳහා ඔබගේ නම කුමක්ද?',
              phone: 'ඔබගේ WhatsApp හෝ phone number එක කුමක්ද?',
              travelDate: 'ඔබ කැමති travel date එක calendar එකෙන් තෝරන්න.',
              travellers: 'සංචාරයට කී දෙනෙක් සහභාගී වෙනවාද?'
            },
            Tamil: {
              name: 'Booking செய்ய உங்கள் பெயர் என்ன?',
              phone: 'உங்கள் WhatsApp அல்லது தொலைபேசி எண் என்ன?',
              travelDate: 'Calendar-இல் உங்களுக்கு விருப்பமான பயண தேதியை தேர்ந்தெடுக்கவும்.',
              travellers: 'எத்தனை பயணிகள் வருகிறார்கள்?'
            }
          };
          answer.nextQuestion = questions[language]?.[missingField] || questions.English[missingField];
        } else {
          requestedField = null;
        }
      }
    }

    const whatsappText = `Hello Lucky Travel! I need help with a booking.\n\n${message}`;
    res.json({
      ...answer,
      aiPowered,
      bookingSaved,
      bookingId,
      requestedField,
      whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'The travel assistant is temporarily unavailable.' });
  }
});

module.exports = router;
