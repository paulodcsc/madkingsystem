const mongoose = require('mongoose');
require('dotenv').config();
const Race = require('./models/Race');
const Class = require('./models/Class');
const Origin = require('./models/Origin');
const Spell = require('./models/Spell');

/**
 * Utility script to get actual IDs from the database for creating test characters
 */

async function getIds() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg');
    console.log('Connected to MongoDB\n');

    // Get all races
    const races = await Race.find().select('_id name subraces');
    console.log('=== RACES ===');
    if (races.length === 0) {
      console.log('No races found in database');
    } else {
      races.forEach(race => {
        console.log(`${race.name}: ${race._id}`);
        if (race.subraces && race.subraces.length > 0) {
          race.subraces.forEach(subrace => {
            console.log(`  - ${subrace.name} (subrace)`);
          });
        }
      });
    }

    // Get all classes
    const classes = await Class.find().select('_id name subclasses');
    console.log('\n=== CLASSES ===');
    if (classes.length === 0) {
      console.log('No classes found in database');
    } else {
      classes.forEach(cls => {
        console.log(`${cls.name}: ${cls._id}`);
        if (cls.subclasses && cls.subclasses.length > 0) {
          cls.subclasses.forEach(subclass => {
            console.log(`  - ${subclass.name} (subclass)`);
          });
        }
      });
    }

    // Get all origins
    const origins = await Origin.find().select('_id name category');
    console.log('\n=== ORIGINS ===');
    if (origins.length === 0) {
      console.log('No origins found in database');
    } else {
      origins.forEach(origin => {
        console.log(`${origin.name} (${origin.category}): ${origin._id}`);
      });
    }

    // Get some spells
    const spells = await Spell.find().select('_id name circle').limit(10);
    console.log('\n=== SPELLS (sample) ===');
    if (spells.length === 0) {
      console.log('No spells found in database');
    } else {
      spells.forEach(spell => {
        console.log(`${spell.name} (Circle ${spell.circle}): ${spell._id}`);
      });
    }

    console.log('\n=== JSON TEMPLATE ===');
    
    if (races.length === 0 || classes.length === 0 || origins.length === 0) {
      console.log('Cannot create template - missing required data. Please run seeds first.');
      return;
    }
    
    // Create a sample JSON structure
    const sampleJson = {
      name: "Test Character",
      race: {
        raceId: races[0]._id,
        subraceName: races[0].subraces && races[0].subraces.length > 0 ? races[0].subraces[0].name : ""
      },
      class: classes[0]._id,
      subclass: {
        name: classes[0].subclasses && classes[0].subclasses.length > 0 ? classes[0].subclasses[0].name : "",
        bonuses: [],
        abilities: []
      },
      origin: origins[0]._id,
      extraSkills: [],
      skills: {
        heavyWeapons: false,
        muscle: false,
        athletics: true,
        endurance: false,
        lightWeapons: false,
        rangedWeapons: false,
        stealth: false,
        acrobatics: false,
        legerdemain: false,
        negotiation: true,
        deception: false,
        intimidation: false,
        seduction: false,
        arcana: false,
        lore: true,
        investigation: false,
        nature: false,
        insight: false
      },
      stats: {
        str: 3,
        dex: 4,
        int: 5,
        cha: 3
      },
      level: 1,
      hp: 15,
      maxHp: 15,
      ac: 12,
      mana: null,
      maxMana: null,
      baseSpeed: 30,
      speedModifiers: [],
      spells: [],
      spellcastingAbility: "",
      armor: {
        name: "Leather Armor",
        acBonus: 2
      },
      items: [
        {
          name: "Sword",
          description: "A basic iron sword",
          quantity: 1,
          value: 15
        },
        {
          name: "Shield",
          description: "Wooden shield",
          quantity: 1,
          value: 10
        }
      ],
      currency: 25,
      backstory: "A brave warrior seeking adventure and glory."
    };

    console.log(JSON.stringify(sampleJson, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  getIds();
}

module.exports = { getIds };