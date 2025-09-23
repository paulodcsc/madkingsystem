// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const Character = require('./models/Character');
const Database = require('./config/database');

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
      'DELETE /characters/:id': 'Delete character by ID'
    }
  });
});

// GET /characters - Get all characters
app.get('/characters', async (req, res) => {
  try {
    const characters = await Character.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: characters.length,
      data: characters
    });
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching characters',
      message: error.message
    });
  }
});

// GET /characters/:id - Get character by ID
app.get('/characters/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({
        success: false,
        error: 'Character not found'
      });
    }
    
    res.json({
      success: true,
      data: character
    });
  } catch (error) {
    console.error('Error fetching character:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid character ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while fetching character',
      message: error.message
    });
  }
});

// POST /characters - Create new character
app.post('/characters', async (req, res) => {
  try {
    const character = new Character(req.body);
    
    // Save to database (validation happens automatically)
    const savedCharacter = await character.save();
    
    res.status(201).json({
      success: true,
      message: 'Character created successfully',
      data: savedCharacter
    });
  } catch (error) {
    console.error('Error creating character:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while creating character',
      message: error.message
    });
  }
});

// PUT /characters/:id - Update character by ID
app.put('/characters/:id', async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators on update
      }
    );
    
    if (!character) {
      return res.status(404).json({
        success: false,
        error: 'Character not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Character updated successfully',
      data: character
    });
  } catch (error) {
    console.error('Error updating character:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors
      });
    }
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid character ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while updating character',
      message: error.message
    });
  }
});

// DELETE /characters/:id - Delete character by ID
app.delete('/characters/:id', async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    
    if (!character) {
      return res.status(404).json({
        success: false,
        error: 'Character not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Character deleted successfully',
      data: character
    });
  } catch (error) {
    console.error('Error deleting character:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid character ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while deleting character',
      message: error.message
    });
  }
});

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