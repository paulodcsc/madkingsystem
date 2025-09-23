// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const Database = require('./config/database');

// Import routes
const characterRoutes = require('./routes/characterRoutes');
const classRoutes = require('./routes/classRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); 
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Mad King RPG Character Sheet API',
    version: '1.0.0',
    endpoints: {
      'GET /characters': 'Get all characters',
      'GET /characters/:id': 'Get character by ID',
      'POST /characters': 'Create new character',
      'PUT /characters/:id': 'Update character by ID',
      'DELETE /characters/:id': 'Delete character by ID',
      'GET /classes': 'Get all classes',
      'GET /classes/:id': 'Get class by ID',
      'POST /classes': 'Create new class',
      'PUT /classes/:id': 'Update class by ID',
      'DELETE /classes/:id': 'Delete class by ID'
    }
  });
});

// Mount routes
app.use('/characters', characterRoutes);
app.use('/classes', classRoutes);

// Handle 404 for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server with database connection
async function startServer() {
  try {
    // Connect to MongoDB
    await Database.connect();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Mad King RPG API server running on port ${PORT}`);
      console.log(`📖 API documentation available at http://localhost:${PORT}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database connection: ${Database.isConnected() ? '✅ Connected' : '❌ Disconnected'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;