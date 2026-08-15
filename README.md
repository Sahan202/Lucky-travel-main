# Lucky Travel — AI-Powered Sri Lanka Travel Platform

> A premium, full-stack travel experience for discovering Sri Lanka, generating personalized journeys, booking tours, and managing customer requests from one dashboard.

[![Website](https://img.shields.io/badge/Live_Website-Explore_Sri_Lanka-22d3ee?style=for-the-badge)](https://lucky-travel-website.vercel.app)
[![Dashboard](https://img.shields.io/badge/Admin-Dashboard-2563eb?style=for-the-badge)](https://lucky-travel-dashboard.vercel.app)
[![API](https://img.shields.io/badge/API-Online-10b981?style=for-the-badge)](https://lucky-travel-api.vercel.app)

## About the project

Lucky Travel combines destination discovery, AI-assisted itinerary planning, tour bookings, multilingual chat support, and content management in a single platform. The public website offers an immersive, responsive experience while the protected dashboard lets the travel team manage packages, bookings, reviews, gallery content, and customer conversations.

## Highlights

- AI-generated, day-by-day Sri Lanka itineraries
- Personalized routes based on dates, budget, travellers, hotels, interests, and selected destinations
- Interactive Sri Lanka destination map powered by OpenStreetMap and Leaflet
- AI activity discovery for surfing, diving, hiking, wildlife, food, culture, wellness, cycling, and more
- Sinhala, English, and Tamil travel chatbot
- Tour discovery, detailed package pages, and direct booking requests
- Chatbot booking collection and dashboard status updates
- Customer confirmation and booking-status emails
- Cloudinary-powered media support
- Customer reviews with an approval workflow
- Gallery and travel-moment management
- Responsive premium UI with GSAP animations and parallax effects
- Secure JWT-protected administration routes

## Platform architecture

```text
Lucky Travel
├── Lucky-Travel/             Public React + TypeScript website
├── Lucky-Travel-dashboard/   Admin CMS dashboard
└── lucy-travel-backend/      Express API, MongoDB, AI, email, and uploads
```

| Application | Technology | Production URL |
| --- | --- | --- |
| Public website | React 19, TypeScript, Vite, Tailwind CSS | [lucky-travel-website.vercel.app](https://lucky-travel-website.vercel.app) |
| Admin dashboard | React, Vite, Tailwind CSS | [lucky-travel-dashboard.vercel.app](https://lucky-travel-dashboard.vercel.app) |
| Backend API | Node.js, Express, MongoDB | [lucky-travel-api.vercel.app](https://lucky-travel-api.vercel.app) |

## Technology stack

**Frontend**

- React and TypeScript
- Vite and Tailwind CSS
- GSAP and ScrollTrigger
- Leaflet and React Leaflet
- Lucide icons
- EmailJS

**Backend**

- Node.js and Express
- MongoDB and Mongoose
- Google Gemini API
- JSON Web Tokens and bcrypt
- Cloudinary and Multer
- Nodemailer / SMTP

**Hosting**

- Vercel
- MongoDB Atlas
- Cloudinary

## Local development

### Requirements

- Node.js 20 or newer
- npm or Yarn
- MongoDB Atlas database
- Gemini API key
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/Sahan202/Lucky-travel-main.git
cd Lucky-travel-main
```

### 2. Start the backend

```bash
cd lucy-travel-backend
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default.

### 3. Start the public website

Open another terminal:

```bash
cd Lucky-Travel
npm install
npm run dev
```

### 4. Start the dashboard

Open another terminal:

```bash
cd Lucky-Travel-dashboard
npm install
npm run dev
```

## Environment variables

Create local `.env` files inside the relevant application folders. Never commit real secrets.

### Backend — `lucy-travel-backend/.env`

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=generate_a_long_random_secret

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_supported_gemini_model

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=your_verified_sender

WHATSAPP_NUMBER=your_whatsapp_number
```

### Public website — `Lucky-Travel/.env`

```env
VITE_API_URL=http://localhost:5000

VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_ADMIN_TEMPLATE_ID=your_admin_template_id
VITE_EMAILJS_USER_TEMPLATE_ID=your_customer_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### Dashboard — `Lucky-Travel-dashboard/.env`

```env
VITE_API_URL=http://localhost:5000
```

## Production builds

```bash
# Public website
cd Lucky-Travel
npm run build

# Dashboard
cd ../Lucky-Travel-dashboard
npm run build
```

## Deployment

Each application is deployed as a separate Vercel project.

```bash
# Backend
cd lucy-travel-backend
npx vercel --prod

# Public website
cd ../Lucky-Travel
npx vercel --prod

# Dashboard
cd ../Lucky-Travel-dashboard
npx vercel --prod
```

Add each application's environment variables in its Vercel project settings before deploying.

## Security notes

- Keep `.env` and `.env.local` files out of Git.
- Never expose MongoDB, Gemini, Cloudinary, SMTP, or JWT secrets in frontend variables.
- Rotate any credential that has been shared publicly.
- Use a long, randomly generated JWT secret in production.
- Restrict MongoDB Atlas and Cloudinary access according to the deployment requirements.

## Main workflows

1. A traveller explores tours, destinations, and activities.
2. The AI planner creates a personalized day-by-day journey.
3. The traveller submits a booking through a tour page or chatbot.
4. The booking appears in the protected dashboard.
5. The travel team updates its status and response.
6. The customer receives email and chatbot booking updates.

## Author

Built by **Sahan Sudeepa** for **Lucky Travel Sri Lanka**.

---

<p align="center">
  <strong>Explore Sri Lanka. Your way.</strong><br />
  Private journeys · Local expertise · AI-powered planning
</p>
