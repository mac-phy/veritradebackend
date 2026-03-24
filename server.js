const express = require('express');
const cors = require('cors');


const app = express();

// Middleware
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'VeriTrade API is running' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Import db FIRST
  const { connectDB, sequelize } = require('./config/db');
  
  // Connect to database
  await connectDB();
  
  // Import models AFTER connection
  const User = require('./models/User');
  const Supplier = require('./models/Supplier');
  const VerificationRequest = require('./models/VerificationRequest');
  
  // Sync database
  await sequelize.sync({ alter: true });
  
  // Import and setup routes AFTER models
  const authRoutes = require('./routes/authRoutes');
  const verificationRoutes = require('./routes/verificationRoutes');
  const adminRoutes = require('./routes/adminRoutes');
  const documentRoutes = require('./routes/documentRoutes');
  const reviewRoutes = require('./routes/reviewRoutes');

 
  app.use('/api/auth', authRoutes);
  app.use('/api/verifications', verificationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/documents', documentRoutes);
   app.use('/api/reviews', reviewRoutes);
  
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ VeriTrade server running on port ${PORT}`);
  });
};

startServer();