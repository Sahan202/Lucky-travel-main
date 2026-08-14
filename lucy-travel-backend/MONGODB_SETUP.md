# MongoDB Setup Instructions

## Prerequisites
1. Install MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Start MongoDB service

## Backend Setup

1. Navigate to backend folder:
```bash
cd "h:\Lucky Travel backend\lucy-travel-backend"
```

2. Install dependencies (already done):
```bash
npm install
```

3. Configure .env file:
- Update MONGODB_URI if using MongoDB Atlas (cloud)
- For local MongoDB: `mongodb://localhost:27017/lucky-travel`
- For MongoDB Atlas: `mongodb+srv://<username>:<password>@cluster.mongodb.net/lucky-travel`

4. Start the backend server:
```bash
npm start
```

Server will run on http://localhost:5000

## Frontend Setup

1. Navigate to frontend folder:
```bash
cd "h:\Lucky Travel backend\Lucky-Travel"
```

2. Start the frontend:
```bash
npm run dev
```

## Testing

1. Go to http://localhost:5173/register
2. Register a new user with email and password
3. Login with the registered credentials
4. You'll be redirected to the home page

## MongoDB Atlas (Cloud) Setup (Optional)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update .env file with the connection string
5. Whitelist your IP address in MongoDB Atlas

## API Endpoints

- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

## Database Structure

Users Collection:
- email (String, unique)
- password (String, hashed)
- createdAt (Date)
