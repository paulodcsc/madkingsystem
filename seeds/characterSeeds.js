const mongoose = require('mongoose');
const Character = require('../models/Character');
const Race = require('../models/Race');
const Class = require('../models/Class');
const Origin = require('../models/Origin');
const Spell = require('../models/Spell');
const Item = require('../models/Item');

/**
 * Character seed data for database initialization
 */

async function seedCharacters() {
  try {
    console.log('🧙 Seeding character data...');
    
    // First, clear existing characters
    await Character.deleteMany({});
    console.log('🗑️ Cleared existing characters');
    
    // Get references to other models for character creation
    const races = await Race.find();
    const classes = await Class.find();
    const origins = await Origin.find();
    const spells = await Spell.find().limit(3); // Get first 3 spells for testing
    const items = await Item.find().limit(5); // Get first 5 items for testing
    
    if (races.length === 0) {
      console.log('⚠️ No races found. Please run race seeds first.');
      return;
    }
    
    if (classes.length === 0) {
      console.log('⚠️ No classes found. Please run class seeds first.');
      return;
    }
    
    if (origins.length === 0) {
      console.log('⚠️ No origins found. Please run origin seeds first.');
      return;
    }
    
    const sampleCharacters = [
      {
        name: "Lyra Thornfield",
        race: races.find(r => r.name === "Human")?._id || races[0]._id,
        class: classes.find(c => c.name === "Warrior")?._id || classes[0]._id,
        origin: origins[0]._id,
        subclass: "Berserker",
        level: 1,
        stats: {
          str: 6,  // High strength for warrior
          dex: 4,  // Moderate dexterity
          int: 3,  // Low intelligence
          cha: 2   // Low charisma
        },
        skills: {
          athletics: true,
          intimidation: true,
          heavyWeapons: true,
          muscle: true
        },
        spells: spells.slice(0, 2).map(s => s._id), // First 2 spells
        items: items.slice(0, 3).map(item => ({
          item: item._id,
          quantity: 1,
          equipped: false // Equipment is now managed through equippedSlots
        })),
        equippedSlots: {
          mainHand: null,
          offHand: null,
          chest: null,
          boots: null,
          gloves: null,
          headgear: null,
          cape: null,
          necklace: null,
          ring: null,
          other: null
        },
        backstory: "A fierce warrior from the northern lands, seeking to prove herself in battle and defend the innocent.",
        currency: 150
      },
      {
        name: "Zephyr Nightwhisper",
        race: races.find(r => r.name === "Elf")?._id || races[0]._id,
        class: classes.find(c => c.name === "Rogue")?._id || classes[1]._id,
        origin: origins[1] ? origins[1]._id : origins[0]._id,
        subclass: "Trickster",
        level: 2,
        stats: {
          str: 3,  // Low strength
          dex: 7,  // High dexterity for rogue
          int: 5,  // Moderate intelligence
          cha: 4   // Moderate charisma
        },
        skills: {
          stealth: true,
          acrobatics: true,
          legerdemain: true,
          deception: true,
          lightWeapons: true
        },
        spells: spells.slice(0, 1).map(s => s._id), // First spell only
        items: items.slice(1, 4).map(item => ({
          item: item._id,
          quantity: 1,
          equipped: false // Equipment is now managed through equippedSlots
        })),
        equippedSlots: {
          mainHand: null,
          offHand: null,
          chest: null,
          boots: null,
          gloves: null,
          headgear: null,
          cape: null,
          necklace: null,
          ring: null,
          other: null
        },
        backstory: "A mysterious rogue who walks in the shadows, using wit and agility to overcome obstacles.",
        currency: 200
      },
      {
        name: "Arcanus the Wise",
        race: races.find(r => r.name === "Human")?._id || races[0]._id,
        class: classes.find(c => c.name === "Wizard")?._id || classes[2]._id,
        origin: origins[2] ? origins[2]._id : origins[0]._id,
        subclass: "Necromancer",
        level: 3,
        stats: {
          str: 2,  // Low strength
          dex: 3,  // Low dexterity
          int: 8,  // High intelligence for wizard
          cha: 5   // Moderate charisma
        },
        skills: {
          arcana: true,
          lore: true,
          investigation: true,
          insight: true,
          nature: true
        },
        spells: spells.map(s => s._id), // All available spells
        items: items.slice(2, 5).map(item => ({
          item: item._id,
          quantity: 1,
          equipped: false // Equipment is now managed through equippedSlots
        })),
        equippedSlots: {
          mainHand: null,
          offHand: null,
          chest: null,
          boots: null,
          gloves: null,
          headgear: null,
          cape: null,
          necklace: null,
          ring: null,
          other: null
        },
        backstory: "A learned wizard who has dedicated his life to the study of magic and the mysteries of the arcane.",
        currency: 75
      }
    ];
    
    // Create characters
    const characters = [];
    for (const characterData of sampleCharacters) {
      try {
        const character = new Character(characterData);
        await character.save();
        characters.push(character);
        console.log(`✅ Created character: ${character.name} (Level ${character.level} ${characterData.subclass})`);
      } catch (error) {
        console.error(`❌ Failed to create character ${characterData.name}:`, error.message);
      }
    }
    
    console.log(`\n📊 Character seeding completed: ${characters.length} characters created`);
    
    // Display character summary
    for (const character of characters) {
      await character.populate(['race', 'class', 'origin']);
      console.log(`\n🧙 ${character.name}:`);
      console.log(`   Race: ${character.race.name}`);
      console.log(`   Class: ${character.class.name} (${character.subclass})`);
      console.log(`   Level: ${character.level}`);
      console.log(`   HP: ${character.hp}/${character.maxHp}`);
      console.log(`   Mana: ${character.mana}/${character.maxMana}`);
      console.log(`   Stats: STR ${character.stats.str}, DEX ${character.stats.dex}, INT ${character.stats.int}, CHA ${character.stats.cha}`);
      console.log(`   AC: ${character.totalAC}, Speed: ${character.totalSpeed}`);
    }
    
    return characters;
    
  } catch (error) {
    console.error('❌ Error seeding characters:', error);
    throw error;
  }
}

module.exports = { seedCharacters };

// Run if called directly for testing
if (require.main === module) {
  require('dotenv').config();
  async function testCharacterSeeds() {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg');
      console.log('Connected to database');
      await seedCharacters();
      await mongoose.connection.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Test failed:', error);
      process.exit(1);
    }
  }
  testCharacterSeeds();
}