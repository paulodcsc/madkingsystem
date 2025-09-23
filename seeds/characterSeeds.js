const mongoose = require('mongoose');
const Character = require('../models/Character');
const Class = require('../models/Class');
const Race = require('../models/Race');
const Origin = require('../models/Origin');

/**
 * Sample character template data for seeding the database
 * This will be transformed to reference actual Race and Class documents
 */

const characterTemplates = [
  {
    name: "Lyra Thornfield",
    raceName: "Human",
    subraceName: "Commoner",
    className: "Warrior",
    subclassName: "Berserker",
    originName: "Farmer",
    extraSkills: ["stealth", "arcana"],
    stats: {
      str: 4,
      dex: 3,
      int: 2,
      cha: 3
    },
    level: 3,
    hp: 25,
    maxHp: 25,
    ac: 12,
    mana: null,
    maxMana: null,
    armor: {
      name: "Leather armor",
      acBonus: 2
    },
    items: [
      {
        name: "Greatsword",
        description: "A well-balanced two-handed sword",
        quantity: 1,
        value: 50
      },
      {
        name: "Rations",
        description: "Travel food for 3 days",
        quantity: 6,
        value: 2
      }
    ],
    currency: 35,
    backstory: "A farmer turned warrior after the Mad King's curse claimed her village, now delving for sigils to buy a cure."
  },
  {
    name: "Kael Shadowstep",
    raceName: "Elf",
    subraceName: "Wood Elf",
    className: "Rogue",
    subclassName: "Trickster",
    originName: "Street Thief",
    extraSkills: ["acrobatics", "deception"],
    stats: {
      str: 2,
      dex: 5,
      int: 4,
      cha: 3
    },
    level: 2,
    hp: 16,
    maxHp: 16,
    ac: 14,
    mana: 12,
    maxMana: 12,
    spellcastingAbility: 'int',
    armor: {
      name: "Studded leather",
      acBonus: 3
    },
    items: [
      {
        name: "Shortsword",
        description: "A lightweight, nimble blade",
        quantity: 1,
        value: 25
      },
      {
        name: "Thieves' Tools",
        description: "Lockpicks and other tools for bypassing security",
        quantity: 1,
        value: 25
      }
    ],
    currency: 42,
    backstory: "A cunning elf who learned magic on the streets, now using illusion and stealth to survive the Mad King's realm."
  },
  {
    name: "Morgana Darkvein",
    raceName: "Human",
    subraceName: "Noble",
    className: "Wizard",
    subclassName: "Necromancer",
    originName: "Scholar",
    extraSkills: ["nature", "insight"],
    stats: {
      str: 1,
      dex: 2,
      int: 6,
      cha: 4
    },
    level: 4,
    hp: 18,
    maxHp: 18,
    ac: 10,
    mana: 32,
    maxMana: 32,
    spellcastingAbility: 'int',
    armor: {
      name: "Robes",
      acBonus: 0
    },
    items: [
      {
        name: "Staff of Bones",
        description: "A gnarled staff topped with a skull, humming with necromantic energy",
        quantity: 1,
        value: 200
      },
      {
        name: "Spellbook",
        description: "A leather-bound tome filled with arcane formulas",
        quantity: 1,
        value: 100
      },
      {
        name: "Component Pouch",
        description: "Contains various spell components",
        quantity: 1,
        value: 25
      }
    ],
    currency: 125,
    backstory: "A brilliant scholar who turned to necromancy to understand death itself, seeking forbidden knowledge in the Mad King's domain."
  },
  {
    name: "Bjorn Ironbeard",
    raceName: "Dwarf",
    subraceName: "Mountain Dwarf",
    className: "Warrior",
    subclassName: "Berserker",
    originName: "Soldier",
    extraSkills: ["endurance", "investigation"],
    stats: {
      str: 6,
      dex: 2,
      int: 3,
      cha: 2
    },
    level: 3,
    hp: 42,
    maxHp: 42,
    ac: 15,
    mana: null,
    maxMana: null,
    armor: {
      name: "Chain mail",
      acBonus: 4
    },
    items: [
      {
        name: "Warhammer",
        description: "A heavy dwarven warhammer with intricate runes",
        quantity: 1,
        value: 75
      },
      {
        name: "Shield",
        description: "A sturdy iron shield bearing the smith's mark",
        quantity: 1,
        value: 30
      },
      {
        name: "Smith's Tools",
        description: "Hammer, tongs, and other blacksmithing implements",
        quantity: 1,
        value: 20
      }
    ],
    currency: 68,
    backstory: "A dwarven blacksmith whose forge was consumed by the Mad King's curse, now wielding hammer and rage in equal measure."
  }
];

/**
 * Seeds the database with characters that reference Race and Class models
 */
async function seedCharacters() {
  try {
    console.log('Starting character seeding...');
    
    // Clear existing characters
    await Character.deleteMany({});
    console.log('✅ Cleared existing characters');

    // Get all races, classes, and origins from database
    const races = await Race.find({});
    const classes = await Class.find({});
    const origins = await Origin.find({});
    
    if (races.length === 0) {
      throw new Error('No races found in database. Please run race seeds first.');
    }
    
    if (classes.length === 0) {
      throw new Error('No classes found in database. Please run class seeds first.');
    }

    if (origins.length === 0) {
      throw new Error('No origins found in database. Please run origin seeds first.');
    }

    console.log(`Found ${races.length} races, ${classes.length} classes, and ${origins.length} origins in database`);

    // Create characters
    const createdCharacters = [];
    
    for (const template of characterTemplates) {
      try {
        // Find the race and class documents
        const race = races.find(r => r.name === template.raceName);
        const characterClass = classes.find(c => c.name === template.className);
        
        if (!race) {
          console.warn(`⚠️ Race '${template.raceName}' not found for character '${template.name}', skipping...`);
          continue;
        }
        
        if (!characterClass) {
          console.warn(`⚠️ Class '${template.className}' not found for character '${template.name}', skipping...`);
          continue;
        }

        // Find subrace if specified
        let subrace = null;
        if (template.subraceName) {
          subrace = race.subraces.find(sr => sr.name === template.subraceName);
          if (!subrace) {
            console.warn(`⚠️ Subrace '${template.subraceName}' not found for race '${template.raceName}', using base race only`);
          }
        }

        // Find subclass if specified
        let subclass = { name: '', abilities: [], bonuses: [] };
        if (template.subclassName) {
          const foundSubclass = characterClass.subclasses.find(sc => sc.name === template.subclassName);
          if (foundSubclass) {
            subclass = {
              name: foundSubclass.name,
              abilities: foundSubclass.abilities || [],
              bonuses: foundSubclass.bonuses || []
            };
          } else {
            console.warn(`⚠️ Subclass '${template.subclassName}' not found for class '${template.className}', using base class only`);
          }
        }

        // Find origin
        const origin = origins.find(o => o.name === template.originName);
        if (!origin) {
          console.warn(`⚠️ Origin '${template.originName}' not found for character '${template.name}', skipping...`);
          continue;
        }

        // Build character data
        const characterData = {
          name: template.name,
          race: {
            raceId: race._id,
            name: race.name,
            subraceName: subrace ? subrace.name : '',
            bonuses: [], // Character-specific bonuses from race
            abilities: [] // Character-specific abilities from race
          },
          class: {
            classId: characterClass._id,
            name: characterClass.name,
            bonuses: [], // Character-specific bonuses from class
            skills: [] // Character-specific skills from class
          },
          subclass: subclass,
          origin: {
            originId: origin._id,
            name: origin.name,
            bonuses: [], // Character-specific bonuses from origin
            abilities: [], // Character-specific abilities from origin
            skills: [] // Character-specific skills from origin
          },
          extraSkills: template.extraSkills,
          stats: template.stats,
          level: template.level,
          hp: template.hp,
          maxHp: template.maxHp,
          ac: template.ac,
          mana: template.mana,
          maxMana: template.maxMana,
          spellcastingAbility: template.spellcastingAbility || '',
          armor: template.armor,
          items: template.items,
          currency: template.currency,
          backstory: template.backstory
        };

        // Create the character
        const character = new Character(characterData);
        await character.save();

        // Populate origin for display purposes
        await character.populate('origin.originId');
        createdCharacters.push(character);
        
        console.log(`✅ Created character: ${character.name} (${race.name}${subrace ? ` ${subrace.name}` : ''} ${characterClass.name}${subclass.name ? `/${subclass.name}` : ''})`);
        
      } catch (charError) {
        console.error(`❌ Error creating character '${template.name}':`, charError.message);
      }
    }

    console.log(`\n✅ Successfully created ${createdCharacters.length} characters`);
    
    // Display summary
    if (createdCharacters.length > 0) {
      console.log('\n--- Character Summary ---');
      
      createdCharacters.forEach((character, index) => {
        console.log(`${index + 1}. ${character.name}`);
        console.log(`   Race: ${character.race.name}${character.race.subraceName ? ` (${character.race.subraceName})` : ''}`);
        console.log(`   Class: ${character.class.name}${character.subclass.name ? `/${character.subclass.name}` : ''}`);
        console.log(`   Level: ${character.level}`);
        console.log(`   Stats: STR ${character.stats.str}, DEX ${character.stats.dex}, INT ${character.stats.int}, CHA ${character.stats.cha}`);
        console.log(`   HP: ${character.hp}/${character.maxHp}, AC: ${character.ac}${character.mana ? `, Mana: ${character.mana}/${character.maxMana}` : ''}`);
        console.log(`   Origin: ${character.origin.name}`);
        console.log(`   Currency: ${character.currency} MKS`);
        console.log('');
      });

      // Group by race
      const raceCounts = {};
      createdCharacters.forEach(char => {
        const raceKey = char.race.subraceName ? `${char.race.name} (${char.race.subraceName})` : char.race.name;
        raceCounts[raceKey] = (raceCounts[raceKey] || 0) + 1;
      });
      
      console.log('Characters by Race:');
      Object.entries(raceCounts).forEach(([raceName, count]) => {
        console.log(`  ${raceName}: ${count}`);
      });

      // Group by class
      const classCounts = {};
      createdCharacters.forEach(char => {
        const classKey = char.subclass.name ? `${char.class.name}/${char.subclass.name}` : char.class.name;
        classCounts[classKey] = (classCounts[classKey] || 0) + 1;
      });
      
      console.log('\nCharacters by Class:');
      Object.entries(classCounts).forEach(([className, count]) => {
        console.log(`  ${className}: ${count}`);
      });
    }
    
    return createdCharacters;

  } catch (error) {
    console.error('❌ Error seeding characters:', error);
    throw error;
  }
}

/**
 * Run the seed function if this file is executed directly
 */
if (require.main === module) {
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('Connected to MongoDB');
      return seedCharacters();
    })
    .then(() => {
      console.log('Character seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = { seedCharacters, characterTemplates };