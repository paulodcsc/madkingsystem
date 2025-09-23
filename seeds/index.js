const { seedSpells } = require('./spellSeeds');
const { seedClasses } = require('./classSeeds');
const { seedCharacters } = require('./characterSeeds');

/**
 * Master seed runner for all database seeds
 */

async function runAllSeeds() {
  console.log('='.repeat(50));
  console.log('Starting Mad King Database Seeding');
  console.log('='.repeat(50));
  
  try {
    // Run class seeds first (characters may reference classes)
    console.log('\n⚔️ Running Class Seeds...');
    await seedClasses();
    
    // Run spell seeds
    console.log('\n🔮 Running Spell Seeds...');
    await seedSpells();
    
    // Run character seeds last (may reference classes)
    console.log('\n🧙 Running Character Seeds...');
    await seedCharacters();
    
    console.log('\n✅ All seeds completed successfully!');
    
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllSeeds();
}

module.exports = { runAllSeeds, seedSpells, seedClasses, seedCharacters };