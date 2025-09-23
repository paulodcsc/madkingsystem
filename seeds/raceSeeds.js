const mongoose = require('mongoose');
const Race = require('../models/Race');

/**
 * Seed data for Races
 */

const raceData = [
  {
    name: 'Human',
    description: 'Versatile and adaptable, humans are the most common race in the realm. They possess natural curiosity and determination that drives them to excel in any path they choose.',
    size: 'Medium',
    languages: ['Common'],
    abilities: [
      {
        name: 'Versatile Learning',
        description: 'Humans learn quickly and adapt to new situations. Gain one additional skill proficiency of your choice.',
        level: 1
      }
    ],
    bonuses: [
      {
        type: 'STR',
        value: 1,
        description: 'Human adaptability grants +1 to Strength'
      },
      {
        type: 'CHA',
        value: 1,
        description: 'Human social nature grants +1 to Charisma'
      },
      {
        type: 'Speed',
        value: 5,
        description: 'Human determination grants +5 feet movement speed'
      }
    ],
    skills: [],
    subraces: [
      {
        name: 'Noble',
        description: 'Humans of noble birth, raised with education and refinement.',
        abilities: [
          {
            name: 'Noble Bearing',
            description: 'Your noble upbringing grants you advantage on negotiation checks with other nobles and authority figures.',
            level: 1
          }
        ],
        bonuses: [
          {
            type: 'CHA',
            value: 1,
            description: 'Noble education grants additional +1 to Charisma'
          }
        ],
        skills: ['negotiation', 'lore']
      },
      {
        name: 'Commoner',
        description: 'Humans of common birth, hardened by practical experience.',
        abilities: [
          {
            name: 'Hard Work',
            description: 'Your life of labor grants you advantage on endurance checks and resistance to exhaustion.',
            level: 1
          }
        ],
        bonuses: [
          {
            type: 'STR',
            value: 1,
            description: 'Physical labor grants additional +1 to Strength'
          }
        ],
        skills: ['athletics', 'endurance']
      }
    ],
    naturalArmor: 0,
    darkvision: 0
  },
  
  {
    name: 'Elf',
    description: 'Graceful and long-lived, elves are deeply connected to magic and nature. Their keen senses and natural dexterity make them excellent scouts and spellcasters.',
    size: 'Medium',
    languages: ['Common', 'Elvish'],
    abilities: [
      {
        name: 'Keen Senses',
        description: 'Your acute senses grant you advantage on investigation checks to notice hidden objects or creatures.',
        level: 1
      },
      {
        name: 'Elven Magic',
        description: 'You know one cantrip of your choice from any spell list. Your spellcasting ability for this cantrip is Intelligence.',
        level: 1
      }
    ],
    bonuses: [
      {
        type: 'DEX',
        value: 2,
        description: 'Elven grace grants +2 to Dexterity'
      },
      {
        type: 'INT',
        value: 1,
        description: 'Elven intellect grants +1 to Intelligence'
      },
      {
        type: 'Speed',
        value: 5,
        description: 'Elven grace grants +5 feet movement speed'
      }
    ],
    skills: ['investigation', 'nature'],
    subraces: [
      {
        name: 'High Elf',
        description: 'Elves with strong magical heritage and scholarly pursuits.',
        abilities: [
          {
            name: 'Cantrip',
            description: 'You know one additional cantrip from the wizard spell list.',
            level: 1
          }
        ],
        bonuses: [
          {
            type: 'INT',
            value: 1,
            description: 'High Elf magical study grants additional +1 to Intelligence'
          }
        ],
        skills: ['arcana', 'lore']
      },
      {
        name: 'Wood Elf',
        description: 'Elves who live in harmony with nature and excel at archery.',
        abilities: [
          {
            name: 'Elf Weapon Training',
            description: 'You have proficiency with longswords, shortbows, longbows, and light weapons.',
            level: 1
          }
        ],
        bonuses: [
          {
            type: 'DEX',
            value: 1,
            description: 'Wood Elf agility grants additional +1 to Dexterity'
          }
        ],
        skills: ['rangedWeapons', 'stealth']
      }
    ],
    naturalArmor: 0,
    darkvision: 60
  },
  
  {
    name: 'Dwarf',
    description: 'Stout and resilient, dwarves are renowned for their craftsmanship, bravery, and stubborn determination. They have natural resistance to magic and toxins.',
    size: 'Medium',
    languages: ['Common', 'Dwarvish'],
    abilities: [
      {
        name: 'Dwarven Resilience',
        description: 'You have advantage on saving throws against poison and resistance to poison damage.',
        level: 1
      },
      {
        name: 'Stonecunning',
        description: 'You have advantage on investigation checks related to stonework and underground environments.',
        level: 1
      }
    ],
    bonuses: [
      {
        type: 'STR',
        value: 2,
        description: 'Dwarven strength grants +2 to Strength'
      },
      {
        type: 'HP',
        value: 5,
        description: 'Dwarven toughness grants +5 to maximum HP'
      }
    ],
    skills: ['muscle', 'endurance'],
    subraces: [
      {
        name: 'Mountain Dwarf',
        description: 'Dwarves from high mountain peaks, known for their warrior traditions.',
        abilities: [
          {
            name: 'Armor Training',
            description: 'You have proficiency with light and medium armor.',
            level: 1
          }
        ],
        bonuses: [
          {
            type: 'STR',
            value: 1,
            description: 'Mountain Dwarf warrior training grants additional +1 to Strength'
          },
          {
            type: 'AC',
            value: 1,
            description: 'Natural toughness grants +1 to AC'
          }
        ],
        skills: ['heavyWeapons', 'athletics']
      },
      {
        name: 'Hill Dwarf',
        description: 'Dwarves from rolling hills, known for their wisdom and connection to nature.',
        abilities: [
          {
            name: 'Dwarven Toughness',
            description: 'Your hit point maximum increases by 1 for each level you have.',
            level: 1
          }
        ],
        bonuses: [
          {
            type: 'HP',
            value: 10,
            description: 'Hill Dwarf toughness grants additional +10 to maximum HP'
          }
        ],
        skills: ['nature', 'insight']
      }
    ],
    naturalArmor: 1,
    darkvision: 60
  },
  
  {
    name: 'Halfling',
    description: 'Small in stature but big in heart, halflings are naturally lucky and brave. They prefer comfort and simple pleasures but can be surprisingly courageous when needed.',
    size: 'Small',
    languages: ['Common', 'Halfling'],
    abilities: [
      {
        name: 'Lucky',
        description: 'When you roll a 1 on a d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
        level: 1
      },
      {
        name: 'Brave',
        description: 'You have advantage on saving throws against being frightened.',
        level: 1
      }
    ],
    bonuses: [
      {
        type: 'DEX',
        value: 2,
        description: 'Halfling nimbleness grants +2 to Dexterity'
      },
      {
        type: 'CHA',
        value: 1,
        description: 'Halfling friendliness grants +1 to Charisma'
      }
    ],
    skills: ['stealth', 'acrobatics'],
    subraces: [
      {
        name: 'Lightfoot',
        description: 'The most common halfling subrace, known for their ability to blend in.',
        abilities: [
          {
            name: 'Naturally Stealthy',
            description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.',
            level: 1
          }
        ],
        bonuses: [
          {
            type: 'CHA',
            value: 1,
            description: 'Lightfoot charm grants additional +1 to Charisma'
          }
        ],
        skills: ['stealth', 'deception']
      },
      {
        name: 'Stout',
        description: 'Hardier halflings with some dwarven heritage.',
        abilities: [
          {
            name: 'Stout Resilience',
            description: 'You have advantage on saving throws against poison and resistance to poison damage.',
            level: 1
          }
        ],
        bonuses: [
          {
            type: 'HP',
            value: 5,
            description: 'Stout constitution grants +5 to maximum HP'
          }
        ],
        skills: ['endurance', 'athletics']
      }
    ],
    naturalArmor: 0,
    darkvision: 0
  }
];

/**
 * Seeds the database with race data
 */
async function seedRaces() {
  try {
    // Clear existing race data
    await Race.deleteMany({});
    console.log('Cleared existing race data');
    
    // Insert new race data
    const races = await Race.insertMany(raceData);
    console.log(`✅ Created ${races.length} races:`);
    
    races.forEach(race => {
      const subraceCount = race.subraces.length;
      const subraceText = subraceCount > 0 ? ` (${subraceCount} subraces)` : '';
      console.log(`   - ${race.name}${subraceText}`);
    });
    
    return races;
    
  } catch (error) {
    console.error('❌ Error seeding races:', error);
    throw error;
  }
}

// Export for use in other modules
module.exports = { seedRaces, raceData };

// If run directly, execute the seed
if (require.main === module) {
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('Connected to MongoDB');
      return seedRaces();
    })
    .then(() => {
      console.log('Race seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}