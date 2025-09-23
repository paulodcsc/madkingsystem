const mongoose = require('mongoose');

/**
 * Database configuration and connection setup
 */
class Database {
  static async connect() {
    try {
      const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg';
      
      // MongoDB connection options
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
      
      // Connect to MongoDB
      await mongoose.connect(connectionString, options);
      
      console.log('🗄️  MongoDB connected successfully');
      console.log(`📍 Database: ${mongoose.connection.name}`);
      console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
      
      return mongoose.connection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      console.error('💡 Make sure MongoDB is running and the connection string is correct');
      process.exit(1);
    }
  }
  
  static async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('🔌 MongoDB disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error.message);
    }
  }
  
  static getConnection() {
    return mongoose.connection;
  }
  
  static isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await Database.disconnect();
  process.exit(0);
});

module.exports = Database;