const mongoose = require('mongoose');
const Character = require('./models/Character');
const Race = require('./models/Race');
const Class = require('./models/Class');
const Origin = require('./models/Origin');
const Spell = require('./models/Spell');
const Item = require('./models/Item');

async function testCharacterFetch() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg');
    console.log('Connected to database');

    // Attempt to fetch characters
    console.log('Fetching characters...');
    const characters = await Character.find()
      .populate('race', 'name abilities bonuses subraces')
      .populate('class', 'name description hpBonusPerLevel manaBonusPerLevel abilities subclasses')
      .populate('origin', 'name description abilities bonuses skills')
      .populate('spells', 'name circle description manaCost')
      .populate('items.item', 'name description category bonuses requirements')
      .populate('equippedSlots.mainHand', 'name description bonuses weaponHandling')
      .populate('equippedSlots.offHand', 'name description bonuses weaponHandling')
      .populate('equippedSlots.chest', 'name description bonuses')
      .populate('equippedSlots.boots', 'name description bonuses')
      .populate('equippedSlots.gloves', 'name description bonuses')
      .populate('equippedSlots.headgear', 'name description bonuses')
      .populate('equippedSlots.cape', 'name description bonuses')
      .populate('equippedSlots.necklace', 'name description bonuses')
      .populate('equippedSlots.ring', 'name description bonuses')
      .populate('equippedSlots.other', 'name description bonuses')
      .sort({ createdAt: -1 });

    console.log(`Found ${characters.length} characters`);
    console.log('First character:', characters[0]?.name || 'No characters found');
    
    // Test totalAC calculation which might be causing the issue
    if (characters.length > 0) {
      console.log('Testing totalAC calculation...');
      console.log('Character totalAC:', characters[0].totalAC);
    }

  } catch (error) {
    console.error('Error occurred:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Load environment variables
require('dotenv').config();
testCharacterFetch();