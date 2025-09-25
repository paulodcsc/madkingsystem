require('dotenv').config();

const express = require('express');
const Database = require('./config/database');
const Character = require('./models/Character');
const Race = require('./models/Race');
const Class = require('./models/Class');
const Origin = require('./models/Origin');
const Spell = require('./models/Spell');
const Item = require('./models/Item');

const app = express();
app.use(express.json());

app.get('/test-characters', async (req, res) => {
  try {
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
    
    // Test virtual fields that might be causing issues
    const responseData = characters.map(char => {
      try {
        return {
          id: char._id,
          name: char.name,
          level: char.level,
          hp: char.hp,
          maxHp: char.maxHp,
          mana: char.mana,
          maxMana: char.maxMana,
          // totalAC: char.totalAC, // Temporarily disabled
          // totalSpeed: char.totalSpeed, // Temporarily disabled
          race: char.race,
          class: char.class,
          equippedSlots: char.equippedSlots
        };
      } catch (error) {
        console.error('Error processing character:', char.name, error.message);
        return {
          id: char._id,
          name: char.name,
          error: error.message
        };
      }
    });
    
    res.json({
      success: true,
      count: characters.length,
      data: responseData
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

Database.connect()
  .then(() => {
    app.listen(3002, () => {
      console.log('Test server running on port 3002');
    });
  })
  .catch(console.error);