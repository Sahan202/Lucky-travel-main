require('dotenv').config();
const dns = require('node:dns');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
const User = require('./models/User');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const aiRoutes = require('./routes/ai');

// Use reliable DNS resolvers for MongoDB Atlas SRV records when configured.
if (process.env.DNS_SERVERS) {
  const dnsServers = process.env.DNS_SERVERS
    .split(',')
    .map(server => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 5000;

let mailTransporter;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
const statusMessages = {
  collecting: 'We are still collecting the details needed for your booking.',
  pending: 'Your booking request has been received and is being reviewed by our travel team.',
  contacted: 'Our travel team has started following up on your request. Please check your phone or WhatsApp.',
  confirmed: 'Great news! Your booking has been confirmed by Lucky Travel.',
  completed: 'Your booking has been marked as completed. Thank you for choosing Lucky Travel!',
  cancelled: 'Your booking has been cancelled. Please contact us if you would like a new arrangement.'
};

const sendBookingStatusEmail = async booking => {
  const email = String(booking.bookingDetails?.email || '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { sent: false, reason: 'No valid customer email' };
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return { sent: false, reason: 'SMTP is not configured' };
  if (!mailTransporter) {
    mailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  const customerName = booking.bookingDetails?.name || 'Traveller';
  const packageName = booking.recommendedPackage?.name || booking.bookingDetails?.package || 'Sri Lanka tour';
  const message = statusMessages[booking.status] || `Your booking status is now ${booking.status}.`;
  const safeCustomerName = escapeHtml(customerName);
  const safePackageName = escapeHtml(packageName);
  const safeTravelDate = escapeHtml(booking.bookingDetails?.travelDate || 'To be confirmed');
  const safeStatus = escapeHtml(booking.status);
  const safeMessage = escapeHtml(message);
  await mailTransporter.sendMail({
    from: process.env.SMTP_FROM || `Lucky Travel <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${packageName} booking update: ${booking.status}`,
    text: `Hello ${customerName},\n\n${message}\n\nPackage: ${packageName}\nTravel date: ${booking.bookingDetails?.travelDate || 'To be confirmed'}\nStatus: ${booking.status}\n\nLucky Travel`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;background:#071321;color:#e2e8f0;padding:32px;border-radius:18px"><div style="color:#67e8f9;font-size:12px;font-weight:700;letter-spacing:2px">LUCKY TRAVEL</div><h1 style="color:#fff;margin:12px 0">Booking update</h1><p>Hello ${safeCustomerName},</p><p style="font-size:17px;line-height:1.7">${safeMessage}</p><div style="background:#0f2238;padding:18px;border-radius:12px;margin:24px 0"><b style="color:#fff">${safePackageName}</b><p style="margin:8px 0 0">Travel date: ${safeTravelDate}</p><p style="margin:8px 0 0;text-transform:capitalize;color:#67e8f9">Status: ${safeStatus}</p></div><p style="font-size:13px;color:#94a3b8">Our team will contact you if further details are required.</p></div>`
  });
  return { sent: true };
};

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
let db;
let dbConnectionPromise;

function connectDatabase() {
  if (db) return Promise.resolve(db);

  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    })
      .then(() => {
        db = mongoose.connection.db;
        console.log('MongoDB connected to lucky-travel database');
        return db;
      })
      .catch((error) => {
        dbConnectionPromise = null;
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  return dbConnectionPromise;
}

// Vercel functions can start cold. Wait for MongoDB before serving API data.
app.use(async (req, res, next) => {
  if (req.path === '/api/test') return next();

  try {
    await connectDatabase();
    next();
  } catch {
    res.status(503).json({ message: 'Database connection unavailable' });
  }
});

app.use('/api/ai', aiRoutes);
const reviews = [
  {
    id: 1,
    name: "John Doe",
    role: "Entrepreneur",
    text: "Amazing travel experience and professional service.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Smith",
    role: "Traveler",
    text: "Luxury tours and unforgettable memories in Sri Lanka.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "Michael Lee",
    role: "Photographer",
    text: "Beautiful destinations with friendly guides.",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 4
  }
];

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth Header:', authHeader);
  const token = authHeader?.split(' ')[1];
  console.log('Token:', token);
  if (!token) return res.status(403).json({ message: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT Error:', err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Chatbot booking leads (Dashboard)
app.post('/api/tour-bookings', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const clean = value => String(value ?? '').trim();
    const name = clean(req.body.name).slice(0, 100);
    const phone = clean(req.body.phone).slice(0, 30);
    const email = clean(req.body.email).slice(0, 150);
    const travelDate = clean(req.body.travelDate).slice(0, 10);
    const travellers = Number(req.body.travellers);
    const packageId = clean(req.body.packageId).slice(0, 100);
    const packageName = clean(req.body.packageName).slice(0, 150);
    const destination = clean(req.body.destination).slice(0, 300);
    const hotelPreference = clean(req.body.hotelPreference).slice(0, 80);
    if (!name || !phone || !travelDate || !packageName || !Number.isInteger(travellers) || travellers < 1 || travellers > 30) return res.status(400).json({ message: 'Name, phone, travel date, package and a valid traveller count are required.' });
    const requestedDate = new Date(`${travelDate}T00:00:00Z`);
    if (Number.isNaN(requestedDate.getTime()) || requestedDate < new Date(new Date().toISOString().slice(0, 10))) return res.status(400).json({ message: 'Please select a valid future travel date.' });
    const now = new Date();
    const booking = {
      sessionId: crypto.randomUUID(), source: 'tour-details', language: 'English', status: 'pending',
      bookingDetails: { name, phone, email, travelDate, travellers, destination, package: packageName, hotelPreference },
      recommendedPackage: { id: packageId, name: packageName, price: clean(req.body.price), duration: clean(req.body.duration), places: destination },
      lastMessage: `Direct booking request for ${packageName}`,
      messages: [{ role: 'user', content: `Booking request: ${packageName}, ${travelDate}, ${travellers} traveller(s), ${hotelPreference}`, createdAt: now }],
      createdAt: now, updatedAt: now, statusUpdatedAt: now
    };
    const result = await db.collection('chatbotBookings').insertOne(booking);
    res.status(201).json({ message: 'Your booking request has been received.', bookingId: String(result.insertedId), trackingToken: booking.sessionId, status: booking.status });
  } catch (error) {
    console.error('Tour booking create error:', error);
    res.status(500).json({ message: 'Unable to submit your booking request.' });
  }
});

app.get('/api/chatbot-bookings', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const filter = req.query.status && req.query.status !== 'all' ? { status: req.query.status } : {};
    const bookings = await db.collection('chatbotBookings').find(filter).sort({ updatedAt: -1 }).toArray();
    res.json(bookings);
  } catch (error) {
    console.error('Chatbot bookings get error:', error);
    res.status(500).json({ message: 'Unable to load chatbot bookings' });
  }
});

app.put('/api/chatbot-bookings/:id/status', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const allowedStatuses = ['collecting', 'pending', 'contacted', 'confirmed', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ message: 'Invalid booking status' });
    const { ObjectId } = require('mongodb');
    const result = await db.collection('chatbotBookings').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: req.body.status, statusUpdatedAt: new Date(), updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result) return res.status(404).json({ message: 'Booking not found' });
    let emailNotification;
    try {
      emailNotification = await sendBookingStatusEmail(result);
    } catch (emailError) {
      console.error('Booking status email error:', emailError.message);
      emailNotification = { sent: false, reason: 'Email delivery failed' };
    }
    res.json({ ...result, emailNotification, statusMessage: statusMessages[result.status] });
  } catch (error) {
    console.error('Chatbot booking status error:', error);
    res.status(500).json({ message: 'Unable to update booking status' });
  }
});

// Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    const user = await User.findOne({ 
      $or: [{ email }, { username: email }] 
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      message: 'Login successful', 
      token,
      user: { 
        email: user.email,
        username: user.username 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change Password Route
app.post('/api/auth/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Hero Section CRUD (Protected)
app.get('/api/hero', async (req, res) => {
  try {
    if (!db) {
      return res.json({ 
        title: 'Luxury Travel Experiences', 
        subtitle: 'Across Sri Lanka', 
        description: 'Premium tours, private transfers, handpicked destinations and unforgettable journeys tailored for discerning travelers.' 
      });
    }
    const hero = await db.collection('hero').findOne();
    if (!hero) {
      return res.json({ 
        title: 'Luxury Travel Experiences', 
        subtitle: 'Across Sri Lanka', 
        description: 'Premium tours, private transfers, handpicked destinations and unforgettable journeys tailored for discerning travelers.' 
      });
    }
    res.json(hero);
  } catch (error) {
    console.error('Hero get error:', error);
    res.json({ 
      title: 'Luxury Travel Experiences', 
      subtitle: 'Across Sri Lanka', 
      description: 'Premium tours, private transfers, handpicked destinations and unforgettable journeys tailored for discerning travelers.' 
    });
  }
});

app.post('/api/hero', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const { _id, ...updateData } = req.body;
    await db.collection('hero').updateOne({}, { $set: updateData }, { upsert: true });
    res.json({ message: 'Hero created' });
  } catch (error) {
    console.error('Hero create error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/hero', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const { _id, ...updateData } = req.body;
    await db.collection('hero').updateOne({}, { $set: updateData }, { upsert: true });
    res.json({ message: 'Hero updated' });
  } catch (error) {
    console.error('Hero update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Services CRUD (Protected)
app.get('/api/services', async (req, res) => {
  const services = db ? await db.collection('services').find().toArray() : [];
  res.json(services);
});

app.post('/api/services', verifyToken, async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const result = await db.collection('services').insertOne(req.body);
  res.json(result);
});

app.put('/api/services/:id', verifyToken, async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { ObjectId } = require('mongodb');
  await db.collection('services').updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
  res.json({ message: 'Service updated' });
});

app.delete('/api/services/:id', verifyToken, async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const { ObjectId } = require('mongodb');
  await db.collection('services').deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ message: 'Service deleted' });
});

// Tour Packages CRUD (Protected)
app.get('/api/packages', async (req, res) => {
  try {
    const packages = db ? await db.collection('packages').find().toArray() : [];
    res.json(packages);
  } catch (error) {
    console.error('Packages get error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/packages', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const { _id, ...data } = req.body;
    const result = await db.collection('packages').insertOne(data);
    res.json(result);
  } catch (error) {
    console.error('Package create error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/packages/:id', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const { ObjectId } = require('mongodb');
    const { _id, ...updateData } = req.body;
    await db.collection('packages').updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });
    res.json({ message: 'Package updated' });
  } catch (error) {
    console.error('Package update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/packages/:id', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const { ObjectId } = require('mongodb');
    await db.collection('packages').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Package deleted' });
  } catch (error) {
    console.error('Package delete error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Gallery CRUD (Protected)
app.get('/api/gallery', async (req, res) => {
  const gallery = db ? await db.collection('gallery').find().toArray() : [];
  res.json(gallery);
});

app.post('/api/gallery/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'lucky-travel' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const galleryItem = await db.collection('gallery').insertOne({ url: result.secure_url });
    
    res.json({ url: result.secure_url, _id: galleryItem.insertedId });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

app.post('/api/upload/image', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'lucky-travel' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

app.post('/api/gallery', verifyToken, async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' });
  const result = await db.collection('gallery').insertOne(req.body);
  res.json(result);
});

app.delete('/api/gallery/:id', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const { ObjectId } = require('mongodb');
    
    const image = await db.collection('gallery').findOne({ _id: new ObjectId(req.params.id) });
    
    if (image && image.url) {
      const urlParts = image.url.split('/');
      const publicIdWithExt = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExt.split('.')[0];
      
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log('Deleted from Cloudinary:', publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
      }
    }
    
    await db.collection('gallery').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Image deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

// Get all reviews (public route)
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = db ? await db.collection('testimonials').find().toArray() : [];
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Public route to submit review from frontend
app.post('/api/reviews/submit', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const { name, role, text, rating } = req.body;
    
    if (!name || !text || !rating) {
      return res.status(400).json({ message: 'Name, text, and rating are required' });
    }
    
    const review = {
      name,
      role: role || 'Traveler',
      text,
      rating: parseInt(rating),
      image: '',
      createdAt: new Date()
    };
    
    const result = await db.collection('testimonials').insertOne(review);
    res.status(201).json({ message: 'Review submitted successfully!', _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new review
app.post('/api/reviews', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const result = await db.collection('testimonials').insertOne(req.body);
    res.status(201).json({ ...req.body, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update review
app.put('/api/reviews/:id', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const { ObjectId } = require('mongodb');
    const { _id, ...updateData } = req.body;
    await db.collection('testimonials').updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });
    res.json({ message: 'Review updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete review
app.delete('/api/reviews/:id', verifyToken, async (req, res) => {
  try {
    if (!db) return res.status(503).json({ message: 'Database not connected' });
    const { ObjectId } = require('mongodb');
    await db.collection('testimonials').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Network: http://0.0.0.0:${PORT}`);
    console.log('Server accessible from any device on the network');
  });
}

module.exports = app;
