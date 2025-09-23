const Class = require('./models/Class');

/**
 * Sample class data for seeding the database
 * This includes Warrior, Rogue, and Wizard classes with their subclasses
 */

const sampleClasses = [
  {
    name: "Warrior",
    description: "Masters of combat, warriors excel in physical prowess and battlefield tactics.",
    hpBonusPerLevel: 10,
    manaBonusPerLevel: 2,
    abilities: [
      {
        level: 1,
        name: "Battle Hardened",
        description: "Recover HP equal to half your maximum HP once per combat."
      },
      {
        level: 3,
        name: "Vigorous Health",
        description: "Gain +5 additional HP per level permanently."
      },
      {
        level: 5,
        name: "Double Attack",
        description: "Make an additional weapon attack when you take the Attack action."
      },
      {
        level: 7,
        name: "Unstoppable",
        description: "Become immune to fear, charm, and paralysis effects for the rest of combat. Once per day."
      },
      {
        level: 9,
        name: "Weapon Mastery",
        description: "Make three weapon attacks when you take the Attack action."
      }
    ],
    subclasses: [
      {
        name: "Berserker",
        description: "Fierce warriors who channel rage to overwhelm their enemies.",
        abilities: [
          {
            level: 2,
            name: "Frenzy",
            description: "Enter a rage that grants +3 damage to all attacks but -2 AC for 4 rounds. Cannot be canceled early."
          },
          {
            level: 4,
            name: "Wild Weaponry",
            description: "Your AC is increased by 10 + STR while you are not wearing any armor. Your unarmed strikes deal 3 + STR damage."
          },
          {
            level: 6,
            name: "Bloodlust",
            description: "Gain an extra attack and move when you reduce an enemy to 0 HP."
          },
          {
            level: 8,
            name: "Savage Resilience",
            description: "Reduce all incoming damage by 3 points while in combat."
          },
          {
            level: 10,
            name: "Avatar of Rage",
            description: "Once per day you can use an action to grow in size, gain advantage on all attack and strength rolls, deal double damage, receive resistance to all damage and is immune to dying for an entire battle."
          }
        ]
      }
    ]
  },
  {
    name: "Rogue",
    description: "Masters of stealth and precision, rogues strike from the shadows with deadly accuracy.",
    hpBonusPerLevel: 6,
    manaBonusPerLevel: 4,
    abilities: [
      {
        level: 1,
        name: "Critical Strike",
        description: "Double damage when attacking while hidden or when an ally is adjacent to your target."
      },
      {
        level: 3,
        name: "Quick Reflexes",
        description: "Take an additional move action or hide action during your turn."
      },
      {
        level: 5,
        name: "Evasion",
        description: "Reduce damage from one attack per round by half using your reaction."
      },
      {
        level: 7,
        name: "Gone",
        description: "You always roll stealth checks with advantage."
      },
      {
        level: 9,
        name: "Master Thief",
        description: "Automatically succeed on lockpicking and pickpocket attempts that are of difficulty 10 or less."
      }
    ],
    subclasses: [
      {
        name: "Trickster",
        description: "Cunning rogues who use magic and illusion to confound their foes.",
        abilities: [
          {
            level: 2,
            name: "Magic Trick",
            description: "You gain access to the spells of the 1st circle."
          },
          {
            level: 4,
            name: "Ghostly Fingers",
            description: "You can use your lockpicking and pickpocket actions at distance using magic."
          },
          {
            level: 6,
            name: "Arcane Trickster",
            description: "You gain access to the spells of the 2nd circle."
          },
          {
            level: 8,
            name: "Greater Invisibility",
            description: "Become invisible for anytime, can attack while invisible. While invisible you count as hidden for the purpose of Critical Strikes."
          },
          {
            level: 10,
            name: "God of Mischief",
            description: "You gain access to the spells of the 3rd circle. You also gain the ability to change appearance at will and create an perfect illusion of yourself that can walk on a radius of 3 kilometers of you."
          }
        ]
      }
    ]
  },
  {
    name: "Wizard",
    description: "Masters of arcane magic who manipulate the very fabric of reality through spells.",
    hpBonusPerLevel: 4,
    manaBonusPerLevel: 8,
    abilities: [
      {
        level: 1,
        name: "Student of Magic",
        description: "You gain access to the spells of the 1st circle."
      },
      {
        level: 3,
        name: "Apprentice Caster",
        description: "You gain access to the spells of the 2nd circle."
      },
      {
        level: 5,
        name: "Experient Caster",
        description: "You gain access to the spells of the 3rd circle."
      },
      {
        level: 7,
        name: "Spell Mastery",
        description: "You gain access to the spells of the 4th circle."
      },
      {
        level: 9,
        name: "Archmage",
        description: "You gain access to the spells of the 5th circle."
      }
    ],
    subclasses: [
      {
        name: "Necromancer",
        description: "Dark wizards who command death magic and commune with the undead.",
        abilities: [
          {
            level: 2,
            name: "Superior Raise Dead",
            description: "You can have two undead minions under your control at the same time, doubling the damage."
          },
          {
            level: 4,
            name: "Life Drain",
            description: "When you deal damage with a spell you can use you reaction to regain hit points equal to half the damage dealt."
          },
          {
            level: 6,
            name: "Death Weaver",
            description: "When you raise an undead minion, you can choose to weave its form into a more powerful version. You can choose between giving it a +3 on damage or increasing its hit points by 10."
          },
          {
            level: 8,
            name: "Death Magic",
            description: "As an 10 minute ritual, your undead minions can be awakened as independent creatures, gaining their own actions. For each undead you awaken, you lose 1 total mana. You regain this mana if they die. This undead no longer count against your maximum number of controlled undead."
          },
          {
            level: 10,
            name: "Lich Transformation",
            description: "You are a lich, you dont need to eat, sleep or breathe. You can fly in the same velocity as your walking speed. You gain resistance to non-magical physical damage. You choose a final resting place for your phylactery (you choose how it looks like). If you die, you will reanimate at this location after 24 hours with 1 HP and all your equipment."
          }
        ]
      }
    ]
  }
];

/**
 * Function to seed the database with sample class data
 * This should be run once to populate the classes collection
 */
async function seedClasses() {
  try {
    // Clear existing classes
    await Class.deleteMany({});
    
    // Insert sample classes
    const createdClasses = await Class.insertMany(sampleClasses);
    
    console.log(`Successfully seeded ${createdClasses.length} classes:`);
    createdClasses.forEach(cls => {
      console.log(`- ${cls.name} with ${cls.subclasses.length} subclasses`);
    });
    
    return createdClasses;
  } catch (error) {
    console.error('Error seeding classes:', error);
    throw error;
  }
}

module.exports = {
  sampleClasses,
  seedClasses
};