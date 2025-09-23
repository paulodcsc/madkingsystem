const mongoose = require('mongoose');
require('dotenv').config();
const Character = require('../models/Character');

/**
 * Sample character data for seeding the database
 */

const characters = [
  {
    name: "Lyra Thornfield",
    race: {
      name: "Human",
      ability: "Adaptable: reroll once/day"
    },
    class: {
      name: "Warrior",
      bonuses: [
        {"type": "STR", "value": 2},
        {"type": "AC", "value": 2}
      ],
      skills: ["Athletics", "Intimidation"]
    },
    subclass: {
      name: "Berserker",
      bonuses: [{"type": "STR", "value": 1}],
      abilities: ["Frenzy: +3 damage, -2 AC for 4 rounds"]
    },
    origin: {
      name: "Farmer",
      bonuses: [{"type": "STR", "value": 1}],
      skills: ["Animal Handling"]
    },
    extraSkills: ["Stealth", "Occultism"],
    stats: {
      str: 15,
      dex: 12,
      int: 10
    },
    hp: 12,
    maxHp: 12,
    ac: 12,
    mana: null,
    armor: {
      name: "Leather armor",
      acBonus: 2
    },
    items: [
      {
        name: "Greatsword",
        requirements: "STR 12",
        damage: 10,
        type: "weapon"
      }
    ],
    currency: 3,
    backstory: "A farmer turned warrior after the Mad King's curse claimed her village, now delving for sigils to buy a cure."
  },
  {
    name: "Kael Shadowstep",
    race: {
      name: "Elf",
      ability: "Keen Senses: advantage on perception checks"
    },
    class: {
      name: "Rogue",
      bonuses: [
        {"type": "DEX", "value": 2},
        {"type": "AC", "value": 1}
      ],
      skills: ["Stealth", "Sleight of Hand"]
    },
    subclass: {
      name: "Trickster",
      bonuses: [{"type": "INT", "value": 1}],
      abilities: ["Magic Trick: access to 1st circle spells"]
    },
    origin: {
      name: "Street Thief",
      bonuses: [{"type": "DEX", "value": 1}],
      skills: ["Lockpicking"]
    },
    extraSkills: ["Acrobatics", "Deception"],
    stats: {
      str: 10,
      dex: 16,
      int: 14
    },
    hp: 8,
    maxHp: 8,
    ac: 14,
    mana: 8,
    armor: {
      name: "Studded leather",
      acBonus: 3
    },
    items: [
      {
        name: "Shortsword",
        requirements: "DEX 10",
        damage: 6,
        type: "weapon"
      },
      {
        name: "Thieves' Tools",
        type: "tool"
      }
    ],
    currency: 15,
    backstory: "A cunning elf who learned magic on the streets, now using illusion and stealth to survive the Mad King's realm."
  },
  {
    name: "Morgana Darkvein",
    race: {
      name: "Human",
      ability: "Adaptable: reroll once/day"
    },
    class: {
      name: "Wizard",
      bonuses: [
        {"type": "INT", "value": 2},
        {"type": "MANA", "value": 4}
      ],
      skills: ["Arcana", "History"]
    },
    subclass: {
      name: "Necromancer",
      bonuses: [{"type": "INT", "value": 1}],
      abilities: ["Superior Raise Dead: control 2 undead minions simultaneously"]
    },
    origin: {
      name: "Scholar",
      bonuses: [{"type": "INT", "value": 1}],
      skills: ["Research"]
    },
    extraSkills: ["Medicine", "Religion"],
    stats: {
      str: 8,
      dex: 10,
      int: 17
    },
    hp: 6,
    maxHp: 6,
    ac: 10,
    mana: 20,
    armor: {
      name: "Robes",
      acBonus: 0
    },
    items: [
      {
        name: "Staff of Bones",
        requirements: "INT 12",
        damage: 4,
        type: "weapon",
        special: "+2 to necromancy spells"
      },
      {
        name: "Spellbook",
        type: "tool"
      }
    ],
    currency: 25,
    backstory: "A brilliant scholar who turned to necromancy to understand death itself, seeking forbidden knowledge in the Mad King's domain."
  },
  {
    name: "Bjorn Ironbeard",
    race: {
      name: "Dwarf",
      ability: "Hardy: +2 to poison and disease saves"
    },
    class: {
      name: "Warrior",
      bonuses: [
        {"type": "STR", "value": 2},
        {"type": "AC", "value": 2}
      ],
      skills: ["Athletics", "Intimidation"]
    },
    subclass: {
      name: "Berserker",
      bonuses: [{"type": "STR", "value": 1}],
      abilities: ["Frenzy: +3 damage, -2 AC for 4 rounds"]
    },
    origin: {
      name: "Blacksmith",
      bonuses: [{"type": "STR", "value": 1}],
      skills: ["Smithing"]
    },
    extraSkills: ["Survival", "Perception"],
    stats: {
      str: 16,
      dex: 10,
      int: 12
    },
    hp: 16,
    maxHp: 16,
    ac: 15,
    mana: null,
    armor: {
      name: "Chain mail",
      acBonus: 4
    },
    items: [
      {
        name: "Warhammer",
        requirements: "STR 14",
        damage: 12,
        type: "weapon"
      },
      {
        name: "Shield",
        acBonus: 1,
        type: "armor"
      }
    ],
    currency: 8,
    backstory: "A dwarven blacksmith whose forge was consumed by the Mad King's curse, now wielding hammer and rage in equal measure."
  }
];

/**
 * Connect to MongoDB and seed the characters
 */
async function seedCharacters() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');

    // Clear existing characters (optional - comment out if you want to keep existing data)
    console.log('Clearing existing characters...');
    await Character.deleteMany({});
    console.log('Existing characters cleared');

    // Insert new characters
    console.log('Seeding characters...');
    const createdCharacters = await Character.insertMany(characters);
    console.log(`Successfully seeded ${createdCharacters.length} characters:`);
    
    createdCharacters.forEach((character, index) => {
      console.log(`${index + 1}. ${character.name} (${character.race.name} ${character.class.name}/${character.subclass.name})`);
      console.log(`   Stats: STR ${character.stats.str}, DEX ${character.stats.dex}, INT ${character.stats.int}`);
      console.log(`   HP: ${character.hp}/${character.maxHp}, AC: ${character.ac}${character.mana ? `, Mana: ${character.mana}` : ''}`);
      console.log(`   Origin: ${character.origin.name}`);
      console.log(`   Currency: ${character.currency} gold`);
      console.log('');
    });

    console.log('\n--- Character Seed Summary ---');
    console.log(`Total characters seeded: ${createdCharacters.length}`);
    
    // Group by class
    const classCounts = {};
    createdCharacters.forEach(char => {
      classCounts[char.class.name] = (classCounts[char.class.name] || 0) + 1;
    });
    
    console.log('\nCharacters by Class:');
    Object.entries(classCounts).forEach(([className, count]) => {
      console.log(`  ${className}: ${count} characters`);
    });

    // Group by race
    const raceCounts = {};
    createdCharacters.forEach(char => {
      raceCounts[char.race.name] = (raceCounts[char.race.name] || 0) + 1;
    });
    
    console.log('\nCharacters by Race:');
    Object.entries(raceCounts).forEach(([raceName, count]) => {
      console.log(`  ${raceName}: ${count} characters`);
    });

  } catch (error) {
    console.error('Error seeding characters:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

/**
 * Run the seed function if this file is executed directly
 */
if (require.main === module) {
  seedCharacters();
}

module.exports = { seedCharacters, characters };