const mongoose = require('mongoose');
require('dotenv').config();
const Character = require('../models/Character');
const Class = require('../models/Class');
const Race = require('../models/Race');
const Origin = require('../models/Origin');
const Spell = require('../models/Spell');

/**
 * Sample character data for seeding the database
 * This creates diverse characters using different combinations of races, classes, and origins
 */

/**
 * Seeds the database with character data
 */
async function seedCharacters() {
  try {
    // Clear existing character data
    await Character.deleteMany({});
    console.log('Cleared existing character data');

    // Get all the required reference data
    const classes = await Class.find({});
    const races = await Race.find({});
    const origins = await Origin.find({});
    const spells = await Spell.find({});

    if (classes.length === 0 || races.length === 0 || origins.length === 0) {
      throw new Error('Required reference data not found. Make sure to run race, class, and origin seeds first.');
    }

    // Helper function to get random element from array
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
    
    // Helper function to get random number in range
    const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Helper function to get random spells for a character
    const getRandomSpells = (count, maxCircle = 5) => {
      const availableSpells = spells.filter(spell => spell.circle <= maxCircle);
      const selectedSpells = [];
      const shuffled = [...availableSpells].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < Math.min(count, shuffled.length); i++) {
        selectedSpells.push({
          spellId: shuffled[i]._id,
          isKnown: true,
          isPrepared: Math.random() > 0.3, // 70% chance to be prepared
          source: getRandomElement(['class', 'learned', 'item']),
          notes: ''
        });
      }
      
      return selectedSpells;
    };

    // Helper function to generate skill proficiencies based on class and origin
    const generateSkillProficiencies = (characterClass, origin) => {
      const skills = {
        // All skills start as false
        heavyWeapons: false, muscle: false, athletics: false, endurance: false,
        lightWeapons: false, rangedWeapons: false, stealth: false, acrobatics: false, legerdemain: false,
        negotiation: false, deception: false, intimidation: false, seduction: false,
        arcana: false, lore: false, investigation: false, nature: false, insight: false
      };

      // Set skills from class (if class has skills property)
      if (characterClass.skills) {
        characterClass.skills.forEach(skill => {
          if (skills.hasOwnProperty(skill)) {
            skills[skill] = true;
          }
        });
      }

      // Set skills from origin
      if (origin.skills) {
        origin.skills.forEach(skill => {
          if (skills.hasOwnProperty(skill)) {
            skills[skill] = true;
          }
        });
      }

      // Add some random skills based on class type
      const classSkillMaps = {
        'Warrior': ['heavyWeapons', 'muscle', 'athletics', 'intimidation'],
        'Rogue': ['stealth', 'legerdemain', 'acrobatics', 'deception'],
        'Wizard': ['arcana', 'investigation', 'lore', 'nature']
      };

      const classSkills = classSkillMaps[characterClass.name] || [];
      classSkills.forEach(skill => {
        if (Math.random() > 0.4) { // 60% chance to have class-appropriate skills
          skills[skill] = true;
        }
      });

      return skills;
    };

    // Create diverse character templates
    const characterTemplates = [
      {
        name: "Sir Gareth the Bold",
        level: 5,
        preferredClass: "Warrior",
        preferredSubclass: "Berserker",
        preferredRace: "Human",
        preferredSubrace: "Noble",
        preferredOrigin: "Noble",
        personality: "Proud and honorable warrior with a strong sense of justice",
        backstory: "Born into nobility, Sir Gareth chose the path of the warrior to prove his worth beyond his birthright. His family's ancient sword has been passed down for generations, and he seeks to add his own chapter to its legendary history."
      },
      {
        name: "Whisper Shadowstep",
        level: 4,
        preferredClass: "Rogue",
        preferredSubclass: "Trickster",
        preferredRace: "Halfling",
        preferredSubrace: "Lightfoot",
        preferredOrigin: "Street Thief",
        personality: "Quick-witted and cautious, always looking for the next opportunity",
        backstory: "Growing up on the streets taught Whisper that survival often depends on being unseen and unheard. Now she uses her skills for more than just petty theft, seeking to uncover the truth behind her mentor's mysterious disappearance."
      },
      {
        name: "Eldrin Starweaver",
        level: 6,
        preferredClass: "Wizard",
        preferredSubclass: "Necromancer",
        preferredRace: "Elf",
        preferredSubrace: "High Elf",
        preferredOrigin: "Scholar",
        personality: "Intellectual and curious, sometimes to a dangerous degree",
        backstory: "Eldrin's pursuit of knowledge led him down dark paths. His research into necromancy began as academic curiosity but has become an obsession. He believes that understanding death is the key to truly appreciating life."
      },
      {
        name: "Thorin Ironforge",
        level: 3,
        preferredClass: "Warrior",
        preferredRace: "Dwarf",
        preferredSubrace: "Mountain Dwarf",
        preferredOrigin: "Soldier",
        personality: "Stalwart and dependable, slow to trust but fiercely loyal",
        backstory: "A veteran of the Goblin Wars, Thorin lost his unit in a devastating battle. He now seeks to honor their memory by becoming the warrior they believed he could be, carrying their legacy forward."
      },
      {
        name: "Luna Brightblade",
        level: 4,
        preferredClass: "Rogue",
        preferredRace: "Elf",
        preferredSubrace: "Wood Elf",
        preferredOrigin: "Hermit",
        personality: "Contemplative and precise, strikes with deadly accuracy",
        backstory: "After witnessing the destruction of her forest home, Luna retreated to the wilderness for years. She emerged changed, with newfound purpose to protect the natural world from those who would exploit it."
      },
      {
        name: "Magnus Scrollkeeper",
        level: 5,
        preferredClass: "Wizard",
        preferredRace: "Human",
        preferredSubrace: "Commoner",
        preferredOrigin: "Scholar",
        personality: "Methodical and patient, believes knowledge is the greatest power",
        backstory: "Born to a farming family, Magnus showed an early aptitude for magic. His village pooled resources to send him to the capital for education. He now works to make magical knowledge more accessible to common folk."
      },
      {
        name: "Pip Lightfingers",
        level: 2,
        preferredClass: "Rogue",
        preferredRace: "Halfling",
        preferredSubrace: "Stout",
        preferredOrigin: "Farmer",
        personality: "Good-natured but mischievous, with a strong moral compass",
        backstory: "When bandits threatened his family's farm, Pip discovered he had a talent for moving unseen. He now uses these skills to protect his community, though his methods are sometimes questionable."
      },
      {
        name: "Seraphina the Just",
        level: 7,
        preferredClass: "Warrior",
        preferredRace: "Human",
        preferredSubrace: "Noble",
        preferredOrigin: "Noble",
        personality: "Righteous and determined, believes in justice for all",
        backstory: "Born to privilege, Seraphina was horrified to discover her family's wealth came from exploiting the poor. She renounced her inheritance and now fights to right the wrongs of the nobility."
      },
      {
        name: "Zara the Mysterious",
        level: 8,
        preferredClass: "Wizard",
        preferredSubclass: "Necromancer",
        preferredRace: "Elf",
        preferredSubrace: "High Elf",
        preferredOrigin: "Hermit",
        personality: "Enigmatic and wise, speaks in riddles and metaphors",
        backstory: "Zara spent decades in isolation studying ancient texts that others deemed too dangerous. Her knowledge of forbidden magic makes her both feared and sought after by those who need her expertise."
      },
      {
        name: "Bram Stoutaxe",
        level: 4,
        preferredClass: "Warrior",
        preferredSubclass: "Berserker",
        preferredRace: "Dwarf",
        preferredSubrace: "Hill Dwarf",
        preferredOrigin: "Soldier",
        personality: "Boisterous and brave, leads from the front in any conflict",
        backstory: "Bram earned his reputation in countless battles, but a devastating defeat taught him the cost of reckless courage. He now seeks to balance his natural aggression with hard-won wisdom."
      }
    ];

    const characters = [];

    for (const template of characterTemplates) {
      try {
        // Find matching class, race, and origin
        const characterClass = classes.find(c => c.name === template.preferredClass) || getRandomElement(classes);
        const race = races.find(r => r.name === template.preferredRace) || getRandomElement(races);
        const origin = origins.find(o => o.name === template.preferredOrigin) || getRandomElement(origins);

        // Get subrace if specified and available
        let subraceName = '';
        if (template.preferredSubrace && race.subraces && race.subraces.length > 0) {
          const subrace = race.subraces.find(sr => sr.name === template.preferredSubrace);
          subraceName = subrace ? subrace.name : (race.subraces[0]?.name || '');
        } else if (race.subraces && race.subraces.length > 0) {
          subraceName = getRandomElement(race.subraces).name;
        }

        // Calculate base stats (1-6 range as per schema)
        const baseStats = {
          str: getRandomInRange(1, 6),
          dex: getRandomInRange(1, 6),
          int: getRandomInRange(1, 6),
          cha: getRandomInRange(1, 6)
        };

        // Apply racial bonuses (simplified - would need full race bonus logic)
        if (race.bonuses) {
          race.bonuses.forEach(bonus => {
            if (bonus.type === 'STR' && baseStats.str < 6) baseStats.str = Math.min(6, baseStats.str + bonus.value);
            if (bonus.type === 'DEX' && baseStats.dex < 6) baseStats.dex = Math.min(6, baseStats.dex + bonus.value);
            if (bonus.type === 'INT' && baseStats.int < 6) baseStats.int = Math.min(6, baseStats.int + bonus.value);
            if (bonus.type === 'CHA' && baseStats.cha < 6) baseStats.cha = Math.min(6, baseStats.cha + bonus.value);
          });
        }

        // Calculate HP based on class and level
        const baseHP = 10; // Base HP
        const classHPPerLevel = characterClass.hpBonusPerLevel || 5;
        const totalHP = baseHP + (classHPPerLevel * template.level);

        // Calculate Mana if applicable
        let mana = null;
        let maxMana = null;
        let spellcastingAbility = '';
        
        if (characterClass.name === 'Wizard' || (characterClass.name === 'Rogue' && template.preferredSubclass === 'Trickster')) {
          const classManaPerLevel = characterClass.manaBonusPerLevel || 0;
          maxMana = classManaPerLevel * template.level;
          mana = maxMana;
          spellcastingAbility = characterClass.name === 'Wizard' ? 'int' : 'cha';
        }

        // Generate skills
        const skills = generateSkillProficiencies(characterClass, origin);

        // Get spells for spellcasters
        const characterSpells = [];
        if (characterClass.name === 'Wizard') {
          const spellCount = Math.min(template.level + 2, spells.length);
          characterSpells.push(...getRandomSpells(spellCount, Math.min(template.level, 5)));
        } else if (characterClass.name === 'Rogue' && template.preferredSubclass === 'Trickster') {
          const spellCount = Math.max(1, Math.floor(template.level / 2));
          characterSpells.push(...getRandomSpells(spellCount, 2)); // Tricksters get lower level spells
        }

        // Create subclass data if specified
        let subclassData = { name: '', bonuses: [], abilities: [] };
        if (template.preferredSubclass && characterClass.subclasses) {
          const subclass = characterClass.subclasses.find(sc => sc.name === template.preferredSubclass);
          if (subclass) {
            subclassData = {
              name: subclass.name,
              bonuses: subclass.bonuses || [],
              abilities: subclass.abilities.filter(ability => ability.level <= template.level) || []
            };
          }
        }

        // Generate some random items
        const randomItems = [
          { name: 'Travel Rations', description: 'Food for the road', quantity: getRandomInRange(3, 7), value: 2 },
          { name: 'Rope (50 feet)', description: 'Strong hemp rope', quantity: 1, value: 10 },
          { name: 'Torch', description: 'Provides light in darkness', quantity: getRandomInRange(3, 8), value: 1 },
          { name: 'Healing Potion', description: 'Restores some health when consumed', quantity: getRandomInRange(1, 3), value: 25 }
        ];

        // Create the character
        const character = {
          name: template.name,
          race: {
            raceId: race._id,
            subraceName: subraceName
          },
          class: characterClass._id,
          subclass: subclassData,
          origin: origin._id,
          extraSkills: [], // Could add random extra skills here
          skills: skills,
          stats: baseStats,
          level: template.level,
          hp: totalHP,
          maxHp: totalHP,
          ac: 10 + Math.floor((baseStats.dex - 10) / 2), // Base AC + dex modifier
          mana: mana,
          maxMana: maxMana,
          baseSpeed: 30,
          speedModifiers: [],
          spells: characterSpells,
          spellcastingAbility: spellcastingAbility,
          armor: { name: 'Leather Armor', acBonus: getRandomInRange(1, 3) },
          items: getRandomElement(randomItems) ? randomItems.slice(0, getRandomInRange(2, 4)) : [],
          currency: getRandomInRange(10, 100),
          backstory: `${template.personality}\n\n${template.backstory}`
        };

        characters.push(character);

      } catch (error) {
        console.warn(`⚠️ Error creating character ${template.name}:`, error.message);
      }
    }

    // Insert characters into database
    if (characters.length > 0) {
      const createdCharacters = await Character.insertMany(characters);
      console.log(`✅ Created ${createdCharacters.length} characters:`);

      // Display created characters with details
      createdCharacters.forEach((char, index) => {
        console.log(`\n🧙 ${char.name} (Level ${char.level})`);
        console.log(`   Race: ${char.race.subraceName ? `${char.race.subraceName} ` : ''}${races.find(r => r._id.equals(char.race.raceId))?.name || 'Unknown'}`);
        console.log(`   Class: ${char.subclass.name ? `${char.subclass.name} ` : ''}${classes.find(c => c._id.equals(char.class))?.name || 'Unknown'}`);
        console.log(`   Origin: ${origins.find(o => o._id.equals(char.origin))?.name || 'Unknown'}`);
        console.log(`   Stats: STR:${char.stats.str} DEX:${char.stats.dex} INT:${char.stats.int} CHA:${char.stats.cha}`);
        console.log(`   HP: ${char.hp}/${char.maxHp}, AC: ${char.ac}${char.mana !== null ? `, Mana: ${char.mana}/${char.maxMana}` : ''}`);
        console.log(`   Spells: ${char.spells.length} known${char.spellcastingAbility ? ` (${char.spellcastingAbility.toUpperCase()})` : ''}`);
        console.log(`   Items: ${char.items.length}, Currency: ${char.currency} MKS`);
        
        // Show some proficient skills
        const skillsObj = char.skills.toObject ? char.skills.toObject() : char.skills;
        const proficientSkills = Object.entries(skillsObj)
          .filter(([skill, proficient]) => proficient && !skill.startsWith('$'))
          .map(([skill]) => skill)
          .slice(0, 5);
        if (proficientSkills.length > 0) {
          console.log(`   Skills: ${proficientSkills.join(', ')}${proficientSkills.length === 5 ? '...' : ''}`);
        }
      });

      // Summary statistics
      console.log('\n--- Character Creation Summary ---');
      console.log(`Total characters created: ${createdCharacters.length}`);
      
      // Level distribution
      const levelDistribution = {};
      createdCharacters.forEach(char => {
        levelDistribution[char.level] = (levelDistribution[char.level] || 0) + 1;
      });
      console.log('Level distribution:', levelDistribution);
      
      // Class distribution
      const classDistribution = {};
      createdCharacters.forEach(char => {
        const className = classes.find(c => c._id.equals(char.class))?.name || 'Unknown';
        classDistribution[className] = (classDistribution[className] || 0) + 1;
      });
      console.log('Class distribution:', classDistribution);
      
      // Race distribution
      const raceDistribution = {};
      createdCharacters.forEach(char => {
        const raceName = races.find(r => r._id.equals(char.race.raceId))?.name || 'Unknown';
        raceDistribution[raceName] = (raceDistribution[raceName] || 0) + 1;
      });
      console.log('Race distribution:', raceDistribution);

      // Spellcaster count
      const spellcasterCount = createdCharacters.filter(char => char.spells.length > 0).length;
      console.log(`Spellcasters: ${spellcasterCount}/${createdCharacters.length}`);

      return createdCharacters;
    } else {
      console.log('⚠️ No characters were successfully created');
      return [];
    }

  } catch (error) {
    console.error('❌ Error seeding characters:', error);
    throw error;
  }
}

/**
 * Run the seed function if this file is executed directly
 */
if (require.main === module) {
  async function runCharacterSeeds() {
    try {
      // Connect to MongoDB
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB successfully');

      await seedCharacters();
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Close the connection
      await mongoose.connection.close();
      console.log('Database connection closed');
      process.exit(0);
    }
  }
  
  runCharacterSeeds();
}

module.exports = { seedCharacters };