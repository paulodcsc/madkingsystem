const mongoose = require('mongoose');
const Race = require('./models/Race');
const Class = require('./models/Class');
const Origin = require('./models/Origin');
const Item = require('./models/Item');
const Character = require('./models/Character');

async function testDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    console.log('Races:', await Race.countDocuments());
    console.log('Classes:', await Class.countDocuments());
    console.log('Origins:', await Origin.countDocuments());
    console.log('Items:', await Item.countDocuments());
    console.log('Characters:', await Character.countDocuments());
    
    // Test if we can find specific classes
    const classes = await Class.find({});
    console.log('\nFound classes:', classes.map(c => c.name));
    
    const races = await Race.find({});
    console.log('Found races:', races.map(r => r.name));
    
    const origins = await Origin.find({});
    console.log('Found origins:', origins.map(o => o.name));
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

if (require.main === module) {
  testDatabase();
}

module.exports = testDatabase;