const mongoose = require('mongoose');
const { seedSpells } = require('./spellSeeds');
const { seedClasses } = require('./classSeeds');
const { seedRaces } = require('./raceSeeds');
const { seedItems } = require('./itemSeeds');
const { seedOrigins } = require('./originSeeds');
const { seedCharacters } = require('./characterSeeds');

/**
 * Master seed runner for all database seeds
 */

async function runAllSeeds() {
  console.log('='.repeat(50));
  console.log('Starting Mad King Database Seeding');
  console.log('='.repeat(50));
  
  try {
    // Connect to database once
    console.log('\n📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
    
    // Run race seeds first (characters may reference races)
    console.log('\n👥 Running Race Seeds...');
    await seedRaces();
    
    // Run class seeds (characters may reference classes)
    console.log('\n⚔️ Running Class Seeds...');
    await seedClasses();
    
    // Run origin seeds (characters may reference origins)
    console.log('\n📜 Running Origin Seeds...');
    await seedOrigins();
    
    // Run item seeds (characters may reference items)
    console.log('\n🎒 Running Item Seeds...');
    await seedItems();
    
    // Run spell seeds
    console.log('\n🔮 Running Spell Seeds...');
    await seedSpells();
    
    // Run character seeds last (may reference all other models)
    console.log('\n🧙 Running Character Seeds...');
    await seedCharacters();
    
    console.log('\n✅ All seeds completed successfully!');
    
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllSeeds();
}

module.exports = { runAllSeeds, seedSpells, seedClasses, seedRaces, seedItems, seedOrigins, seedCharacters };