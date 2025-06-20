const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const cors = require('cors');

const authRoutes = require('./routes/auth');
const prescriptionRoutes = require('./routes/prescriptions');

const app = express();
const PORT = 5000;

// MongoDB URL
const Mongoose_URL = `mongodb+srv://root:root@mycluster.tkxrr7w.mongodb.net/MediSync?retryWrites=true&w=majority&appName=MyCluster`;

// Connect to MongoDB and set up session store
mongoose
  .connect(Mongoose_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');

    const store = new MongoDbStore({
      uri: Mongoose_URL,
      collection: 'sessions',
    });

    app.use(
      session({
        secret: 'Complete Coding', // You can change secret later
        resave: false,
        saveUninitialized: false,
        store: store,
      })
    );

    // Middlewares
    app.use(cors({
      origin: "http://localhost:3000",
      credentials: true,
    }));
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/prescriptions', prescriptionRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });
