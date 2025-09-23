const mongoose = require('mongoose');
require('dotenv').config();
const Spell = require('../models/Spell');

/**
 * Seed data for spells
 */

const spells = [
  {
    name: "Fireball",
    description: "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame.",
    circle: 3,
    manaCost: 15,
    school: "Dragon Church", // Fixed to match schema enum
    castingTime: "1 action",
    range: "150 feet",
    duration: "Instantaneous",
    components: {
      verbal: true,
      gesture: true,
      focus: false,
      cost: "a tiny ball of bat guano and sulfur"
    },
    area: "20-foot radius sphere",
    damageType: "Fire",
    concentration: false,
    ritual: false,
    tags: ["offensive", "area", "elemental"]
  },
  {
    name: "Healing Light",
    description: "A warm, golden light emanates from your hands, closing wounds and mending broken bones with divine energy.",
    circle: 2,
    manaCost: 8,
    school: "Sacred Veil",
    castingTime: "1 action",
    range: "Touch",
    duration: "Instantaneous",
    components: {
      verbal: true,
      gesture: true,
      focus: false,
      cost: ""
    },
    area: "",
    damageType: "",
    concentration: false,
    ritual: false,
    tags: ["healing", "divine", "beneficial"]
  },
  {
    name: "Magic Missile",
    description: "Three darts of magical force streak from your fingertips toward targets within range, each dart hitting automatically.",
    circle: 1,
    manaCost: 3,
    school: "Astromancy",
    castingTime: "1 action",
    range: "120 feet",
    duration: "Instantaneous",
    components: {
      verbal: true,
      gesture: true,
      focus: false,
      cost: ""
    },
    area: "",
    damageType: "Energy",
    concentration: false,
    ritual: false,
    tags: ["offensive", "force", "reliable"]
  },
  {
    name: "Detect Magic",
    description: "For the duration, you sense the presence of magic within 30 feet of you and can identify the school of magic if present.",
    circle: 1,
    manaCost: 2,
    school: "Astromancy",
    castingTime: "1 action",
    range: "Self",
    duration: "10 minutes",
    components: {
      verbal: true,
      gesture: true,
      focus: false,
      cost: ""
    },
    area: "30-foot radius",
    damageType: "",
    concentration: true,
    ritual: true,
    tags: ["detection", "utility", "divination"]
  },
  {
    name: "Invisibility",
    description: "A creature you touch becomes invisible until the spell ends. The spell ends if the target attacks or casts a spell.",
    circle: 2,
    manaCost: 6,
    school: "Slumbering",
    castingTime: "1 action",
    range: "Touch",
    duration: "1 hour",
    components: {
      verbal: true,
      gesture: true,
      focus: false,
      cost: "an eyelash encased in gum arabic"
    },
    area: "",
    damageType: "",
    concentration: true,
    ritual: false,
    tags: ["stealth", "illusion", "beneficial"]
  },
  {
    name: "Lightning Bolt",
    description: "A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose.",
    circle: 3,
    manaCost: 12,
    school: "Dragon Church",
    castingTime: "1 action",
    range: "Self (100-foot line)",
    duration: "Instantaneous",
    components: {
      verbal: true,
      gesture: true,
      focus: true,
      cost: "a bit of fur and a rod of amber, crystal, or glass"
    },
    area: "100-foot line, 5 feet wide",
    damageType: "Lightning",
    concentration: false,
    ritual: false,
    tags: ["offensive", "elemental", "line"]
  },
  {
    name: "Summon Familiar",
    description: "You gain the service of a familiar, a spirit that takes an animal form you choose. Your familiar acts independently but obeys your commands.",
    circle: 1,
    manaCost: 4,
    school: "Astromancy",
    castingTime: "1 hour",
    range: "10 feet",
    duration: "Instantaneous",
    components: {
      verbal: true,
      gesture: true,
      focus: false,
      cost: "10 gp worth of charcoal, incense, and herbs"
    },
    area: "",
    damageType: "",
    concentration: false,
    ritual: true,
    tags: ["summoning", "companion", "ritual"]
  },
  {
    name: "Dispel Magic",
    description: "Choose one creature, object, or magical effect within range. Any spell of 3rd circle or lower on the target ends.",
    circle: 3,
    manaCost: 10,
    school: "Astromancy",
    castingTime: "1 action",
    range: "120 feet",
    duration: "Instantaneous",
    components: {
      verbal: true,
      gesture: true,
      focus: false,
      cost: ""
    },
    area: "",
    damageType: "",
    concentration: false,
    ritual: false,
    tags: ["utility", "dispel", "counter"]
  },
  {
    name: "Speak with Dead",
    description: "You grant the semblance of life and intelligence to a corpse, allowing you to ask it up to five questions.",
    circle: 3,
    manaCost: 8,
    school: "Deathweaving",
    castingTime: "1 action",
    range: "10 feet",
    duration: "10 minutes",
    components: {
      verbal: true,
      gesture: true,
      focus: false,
      cost: "burning incense"
    },
    area: "",
    damageType: "",
    concentration: false,
    ritual: false,
    tags: ["necromancy", "communication", "information"]
  },
  {
    name: "Entangle",
    description: "Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range, turning the area into difficult terrain.",
    circle: 1,
    manaCost: 3,
    school: "Rootbound",
    castingTime: "1 action",
    range: "90 feet",
    duration: "1 minute",
    components: {
      verbal: true,
      gesture: true,
      focus: false,
      cost: ""
    },
    area: "20-foot square",
    damageType: "",
    concentration: true,
    ritual: false,
    tags: ["control", "nature", "area"]
  }
];

/**
 * Connect to MongoDB and seed the spells
 */
async function seedSpells() {
  try {
    // Clear existing spells (optional - comment out if you want to keep existing data)
    console.log('Clearing existing spells...');
    await Spell.deleteMany({});
    console.log('Existing spells cleared');

    // Insert new spells
    console.log('Seeding spells...');
    const createdSpells = await Spell.insertMany(spells);
    console.log(`Successfully seeded ${createdSpells.length} spells:`);
    
    createdSpells.forEach((spell, index) => {
      console.log(`${index + 1}. ${spell.name} (Circle ${spell.circle}, ${spell.school})`);
    });

    console.log('\n--- Seed Summary ---');
    console.log(`Total spells seeded: ${createdSpells.length}`);
    
    // Show breakdown by circle
    const byCircle = await Spell.getSpellsByCircle();
    console.log('\nSpells by Circle:');
    byCircle.forEach(group => {
      console.log(`  Circle ${group._id}: ${group.count} spells`);
    });

    // Show breakdown by school
    const bySchool = await Spell.getSpellsBySchool();
    console.log('\nSpells by School:');
    bySchool.forEach(group => {
      console.log(`  ${group._id}: ${group.count} spells`);
    });

    return createdSpells;

  } catch (error) {
    console.error('Error seeding spells:', error);
    throw error;
  }
}

/**
 * Run the seed function if this file is executed directly
 */
if (require.main === module) {
  async function runSpellSeeds() {
    try {
      // Connect to MongoDB
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB successfully');

      await seedSpells();
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Close the connection
      await mongoose.connection.close();
      console.log('Database connection closed');
      process.exit(0);
    }
  }
  
  runSpellSeeds();
}

module.exports = { seedSpells, spells };