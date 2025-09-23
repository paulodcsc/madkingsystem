const mongoose = require('mongoose');
const Origin = require('../models/Origin');

/**
 * Seed data for Origins
 */

const originData = [
  {
    name: 'Noble',
    description: 'You were born into privilege and wealth, raised in comfort with the finest education and training. Your family holds significant political or social power.',
    category: 'Noble',
    socialStanding: 'Nobility',
    startingWealth: { min: 100, max: 300 },
    abilities: [
      {
        name: 'Noble Bearing',
        description: 'Your aristocratic upbringing grants you advantage on social interactions with other nobles and authority figures.',
        level: 1
      },
      {
        name: 'Political Connections',
        description: 'You can call upon family influence to gain audiences with important figures or access to restricted areas.',
        level: 1
      }
    ],
    bonuses: [
      { type: 'CHA', value: 1, description: 'Noble education enhances charisma' },
      { type: 'INT', value: 1, description: 'Quality education improves intellect' }
    ],
    skills: ['negotiation', 'lore'],
    languages: ['Common', 'High Court'],
    toolProficiencies: ['Gaming Set', 'Calligraphy Supplies'],
    startingEquipment: [
      { itemName: 'Fine Clothes', quantity: 1, description: 'Expensive noble attire' },
      { itemName: 'Signet Ring', quantity: 1, description: 'Family seal of authority' },
      { itemName: 'Scroll of Pedigree', quantity: 1, description: 'Proof of noble lineage' }
    ],
    connections: [
      {
        name: 'Lord Aldric Bramblewood',
        relationship: 'Family',
        description: 'A powerful lord who owes your family favors',
        location: 'Capital City'
      },
      {
        name: 'Captain Theron Goldguard',
        relationship: 'Ally',
        description: 'Captain of the city guard, loyal to your house',
        location: 'Capital City'
      }
    ],
    personalityTraits: [
      'I take great pride in my family name and history.',
      'I expect the finest things in life and become upset when forced to settle for less.',
      'I speak with authority and expect others to listen.'
    ],
    ideals: [
      {
        name: 'Responsibility',
        description: 'It is my duty to protect and lead those less fortunate.',
        alignment: 'Good'
      },
      {
        name: 'Power',
        description: 'Those born to rule should exercise that privilege.',
        alignment: 'Lawful'
      }
    ],
    bonds: [
      'My family honor is more important than my life.',
      'I will do anything to restore my family\'s lost fortune.',
      'A commoner saved my life, and I owe them a great debt.'
    ],
    flaws: [
      'I secretly believe that everyone is beneath me.',
      'I hide a shameful secret that could ruin my family.',
      'I have an insatiable desire for carnal pleasures.'
    ],
    features: [
      {
        name: 'Position of Privilege',
        description: 'Thanks to your noble birth, people are inclined to think the best of you.',
        mechanicalBenefit: 'Welcome in high society, can secure audiences with local nobles'
      }
    ],
    typicalLocations: ['Royal Courts', 'Noble Estates', 'High-end Establishments'],
    motivations: [
      'Restore lost family honor',
      'Expand political influence',
      'Uncover family secrets',
      'Prove worth beyond birthright'
    ],
    rarity: 'Uncommon'
  },
  
  {
    name: 'Farmer',
    description: 'You come from simple rural folk who work the land. Your life has been one of hard work, seasonal cycles, and connection to nature.',
    category: 'Commoner',
    socialStanding: 'Lower Class',
    startingWealth: { min: 5, max: 20 },
    abilities: [
      {
        name: 'Rural Knowledge',
        description: 'Your lifetime in the countryside grants you extensive knowledge of weather, seasons, crops, and rural customs.',
        level: 1
      },
      {
        name: 'Hardy Constitution',
        description: 'Years of physical labor have toughened your body against harsh conditions and disease.',
        level: 1
      }
    ],
    bonuses: [
      { type: 'STR', value: 1, description: 'Hard physical labor builds strength' },
      { type: 'HP', value: 3, description: 'Rural hardship increases resilience' }
    ],
    skills: ['nature', 'endurance'],
    languages: ['Common', 'Rural Dialect'],
    toolProficiencies: ['Farming Tools', 'Carpenter\'s Tools'],
    startingEquipment: [
      { itemName: 'Work Clothes', quantity: 1, description: 'Sturdy, practical clothing' },
      { itemName: 'Farming Tool', quantity: 1, description: 'Hoe, sickle, or similar implement' },
      { itemName: 'Pouch of Seeds', quantity: 1, description: 'Various crop seeds' }
    ],
    connections: [
      {
        name: 'Elder Marta Greenthumb',
        relationship: 'Mentor',
        description: 'Village elder who taught you about farming and herbal remedies',
        location: 'Home Village'
      },
      {
        name: 'Tam the Miller',
        relationship: 'Contact',
        description: 'Local miller who knows all the village gossip',
        location: 'Nearby Town'
      }
    ],
    personalityTraits: [
      'I judge people by their actions, not their words or station.',
      'I believe hard work solves most problems.',
      'I\'m always willing to lend a helping hand to those in need.'
    ],
    ideals: [
      {
        name: 'Community',
        description: 'We must all work together for the common good.',
        alignment: 'Good'
      },
      {
        name: 'Nature',
        description: 'The natural world deserves our respect and protection.',
        alignment: 'Neutral'
      }
    ],
    bonds: [
      'My family farm has been in our bloodline for generations.',
      'A terrible blight destroyed our crops, and I seek the knowledge to prevent it.',
      'I owe my life to a traveling healer who saved me from disease.'
    ],
    flaws: [
      'I am suspicious of city folk and their complicated ways.',
      'I have a tendency to solve problems with my fists.',
      'I\'m haunted by the memory of a terrible harvest failure.'
    ],
    features: [
      {
        name: 'Rustic Hospitality',
        description: 'Rural folk see you as one of their own and are willing to provide simple accommodations.',
        mechanicalBenefit: 'Can find food and shelter among farming communities'
      }
    ],
    typicalLocations: ['Rural Villages', 'Farmlands', 'Country Markets'],
    motivations: [
      'Protect homeland from threats',
      'Find cure for crop blight',
      'Earn enough to buy more land',
      'Bring prosperity to village'
    ],
    rarity: 'Common'
  },
  
  {
    name: 'Street Thief',
    description: 'You survived on the streets through cunning, stealth, and petty crime. The urban underworld taught you harsh lessons about trust and survival.',
    category: 'Criminal',
    socialStanding: 'Outcast',
    startingWealth: { min: 15, max: 40 },
    abilities: [
      {
        name: 'Urban Survival',
        description: 'You know how to navigate city streets, find safe places to rest, and locate black market goods.',
        level: 1
      },
      {
        name: 'Criminal Contacts',
        description: 'You have connections in the criminal underworld who can provide information or services for a price.',
        level: 1
      }
    ],
    bonuses: [
      { type: 'DEX', value: 2, description: 'Street life develops exceptional agility' }
    ],
    skills: ['stealth', 'legerdemain'],
    languages: ['Common', 'Thieves\' Cant'],
    toolProficiencies: ['Thieves\' Tools', 'Gaming Set'],
    startingEquipment: [
      { itemName: 'Dark Cloak', quantity: 1, description: 'Perfect for blending into shadows' },
      { itemName: 'Thieves\' Tools', quantity: 1, description: 'Lockpicks and other criminal implements' },
      { itemName: 'Belt Pouch', quantity: 1, description: 'Hidden pouch for valuables' }
    ],
    connections: [
      {
        name: 'Sly Pete',
        relationship: 'Contact',
        description: 'A fence who buys stolen goods, no questions asked',
        location: 'City Docks'
      },
      {
        name: 'Iron Magda',
        relationship: 'Rival',
        description: 'Leader of a competing thieves\' gang',
        location: 'City Underworld'
      }
    ],
    personalityTraits: [
      'I always have an escape plan ready.',
      'I can\'t resist taking something that doesn\'t belong to me.',
      'I size up everyone I meet, looking for their weaknesses.'
    ],
    ideals: [
      {
        name: 'Freedom',
        description: 'Chains are meant to be broken, as are those who would forge them.',
        alignment: 'Chaotic'
      },
      {
        name: 'Greed',
        description: 'I will do whatever it takes to become wealthy.',
        alignment: 'Evil'
      }
    ],
    bonds: [
      'My mentor was caught and executed; I will avenge their death.',
      'I stole from the wrong person and now live in fear of retribution.',
      'Someone I loved was killed, and I seek the truth behind their death.'
    ],
    flaws: [
      'When faced with a choice between money and friends, I choose money.',
      'I turn tail and run when things look bad.',
      'An innocent person is in prison for a crime that I committed.'
    ],
    features: [
      {
        name: 'Criminal Network',
        description: 'You have contacts within the criminal underworld who can provide information or services.',
        mechanicalBenefit: 'Can access black market goods and criminal services'
      }
    ],
    typicalLocations: ['City Slums', 'Taverns', 'Back Alleys', 'Thieves\' Dens'],
    motivations: [
      'Pull off the ultimate heist',
      'Clear name of false accusations',
      'Protect fellow outcasts',
      'Find legitimate path forward'
    ],
    rarity: 'Common'
  },
  
  {
    name: 'Scholar',
    description: 'You spent your formative years buried in books, scrolls, and ancient texts. Knowledge and learning are your passions, and few secrets remain hidden from your studies.',
    category: 'Scholar',
    socialStanding: 'Middle Class',
    startingWealth: { min: 30, max: 80 },
    abilities: [
      {
        name: 'Research',
        description: 'You know how to obtain information from libraries, universities, and other repositories of knowledge.',
        level: 1
      },
      {
        name: 'Ancient Knowledge',
        description: 'Your studies of old texts grant you insight into historical events, ancient languages, and forgotten lore.',
        level: 1
      }
    ],
    bonuses: [
      { type: 'INT', value: 2, description: 'Extensive study greatly improves intellect' }
    ],
    skills: ['lore', 'investigation'],
    languages: ['Common', 'Ancient Script', 'Academic Latin'],
    toolProficiencies: ['Calligraphy Supplies', 'Cartographer\'s Tools'],
    startingEquipment: [
      { itemName: 'Scholar\'s Robes', quantity: 1, description: 'Simple but well-made academic robes' },
      { itemName: 'Research Notes', quantity: 1, description: 'Detailed notes on your area of expertise' },
      { itemName: 'Ink and Quill', quantity: 1, description: 'Writing supplies' }
    ],
    connections: [
      {
        name: 'Master Aldwin Scrollkeeper',
        relationship: 'Mentor',
        description: 'Your former professor, now head of the Great Library',
        location: 'University City'
      },
      {
        name: 'Lysa the Archivist',
        relationship: 'Contact',
        description: 'Keeper of restricted texts and forbidden knowledge',
        location: 'Royal Library'
      }
    ],
    personalityTraits: [
      'I speak in scholarly terms and use big words to impress others.',
      'I am incredibly slow to trust others\' claims without proof.',
      'I believe that knowledge should be shared freely with all.'
    ],
    ideals: [
      {
        name: 'Knowledge',
        description: 'The path to power and self-improvement is through knowledge.',
        alignment: 'Neutral'
      },
      {
        name: 'Truth',
        description: 'The truth must be discovered and shared, regardless of consequences.',
        alignment: 'Good'
      }
    ],
    bonds: [
      'The library where I learned everything was destroyed, and I seek to rebuild it.',
      'I work to preserve a body of ancient knowledge related to my specialty.',
      'My life\'s work is a series of tomes related to a specific field of lore.'
    ],
    flaws: [
      'I am easily distracted by the promise of information.',
      'Most people scream and run when they see a demon. I stop and take notes.',
      'Unlocking an ancient mystery is worth the price of a civilization.'
    ],
    features: [
      {
        name: 'Researcher',
        description: 'When you attempt to learn something, you know where to find the information.',
        mechanicalBenefit: 'Can access libraries and scholarly networks for information'
      }
    ],
    typicalLocations: ['Libraries', 'Universities', 'Archives', 'Ancient Ruins'],
    motivations: [
      'Uncover lost knowledge',
      'Publish groundbreaking research',
      'Solve ancient mysteries',
      'Preserve knowledge for future generations'
    ],
    rarity: 'Common'
  },
  
  {
    name: 'Soldier',
    description: 'You served in the military, fighting in wars or keeping the peace. Discipline, loyalty, and tactical thinking are second nature to you.',
    category: 'Military',
    socialStanding: 'Middle Class',
    startingWealth: { min: 20, max: 60 },
    abilities: [
      {
        name: 'Military Bearing',
        description: 'Your military training grants you confidence in command situations and respect from other soldiers.',
        level: 1
      },
      {
        name: 'Battle Tactics',
        description: 'You understand military strategy and can assess battlefield conditions quickly.',
        level: 1
      }
    ],
    bonuses: [
      { type: 'STR', value: 1, description: 'Military training builds physical strength' },
      { type: 'HP', value: 5, description: 'Combat experience increases hardiness' }
    ],
    skills: ['athletics', 'intimidation'],
    languages: ['Common', 'Military Signals'],
    toolProficiencies: ['Gaming Set', 'Land Vehicles'],
    startingEquipment: [
      { itemName: 'Military Uniform', quantity: 1, description: 'Former unit\'s uniform and insignia' },
      { itemName: 'Rank Insignia', quantity: 1, description: 'Symbol of your military rank' },
      { itemName: 'Deck of Cards', quantity: 1, description: 'For passing time in camp' }
    ],
    connections: [
      {
        name: 'Sergeant Korren Ironhand',
        relationship: 'Ally',
        description: 'Your former drill sergeant, now a veteran instructor',
        location: 'Military Training Grounds'
      },
      {
        name: 'Private Jenny Fastfoot',
        relationship: 'Contact',
        description: 'Former squadmate who now works as a courier',
        location: 'Various Cities'
      }
    ],
    personalityTraits: [
      'I face problems head-on with direct, simple solutions.',
      'I enjoy being strong and like breaking things.',
      'I have a crude sense of humor that not everyone appreciates.'
    ],
    ideals: [
      {
        name: 'Greater Good',
        description: 'Our lot is to lay down our lives in defense of others.',
        alignment: 'Good'
      },
      {
        name: 'Might',
        description: 'In life as in war, the stronger force wins.',
        alignment: 'Evil'
      }
    ],
    bonds: [
      'I will never forget the crushing defeat my company suffered.',
      'Those who fight beside me are those worth dying for.',
      'My honor is my life; without it, I am nothing.'
    ],
    flaws: [
      'I made a terrible mistake in battle that cost many lives.',
      'I have little respect for anyone who is not a proven warrior.',
      'I obey the law, even if it causes misery.'
    ],
    features: [
      {
        name: 'Military Rank',
        description: 'You have a military rank from your career. Soldiers loyal to your former organization still recognize your authority.',
        mechanicalBenefit: 'Can requisition simple equipment and gain access to military facilities'
      }
    ],
    typicalLocations: ['Military Camps', 'Veteran Halls', 'Battlefields', 'Guard Posts'],
    motivations: [
      'Serve homeland with honor',
      'Protect innocent civilians',
      'Reunite with former comrades',
      'Make up for past military failures'
    ],
    rarity: 'Common'
  },
  
  {
    name: 'Hermit',
    description: 'You lived in seclusion for years, either in a monastery, deep wilderness, or underground. This isolation granted you unique insights and inner peace.',
    category: 'Hermit',
    socialStanding: 'Lower Class',
    startingWealth: { min: 5, max: 15 },
    abilities: [
      {
        name: 'Solitude Wisdom',
        description: 'Your time alone granted you profound insights into the nature of existence and the cosmos.',
        level: 1
      },
      {
        name: 'Wilderness Survival',
        description: 'You can find food, water, and shelter in the wild, and you know how to avoid natural dangers.',
        level: 1
      }
    ],
    bonuses: [
      { type: 'INT', value: 1, description: 'Contemplation improves wisdom and intellect' },
      { type: 'CHA', value: 1, description: 'Inner peace grants personal magnetism' }
    ],
    skills: ['nature', 'insight'],
    languages: ['Common', 'Celestial OR Draconic'],
    toolProficiencies: ['Herbalism Kit', 'Scroll Making'],
    startingEquipment: [
      { itemName: 'Simple Robes', quantity: 1, description: 'Plain, humble clothing' },
      { itemName: 'Meditation Focus', quantity: 1, description: 'Crystal, holy symbol, or prayer beads' },
      { itemName: 'Herbalism Kit', quantity: 1, description: 'Tools for identifying and preparing herbs' }
    ],
    connections: [
      {
        name: 'Brother Marcus',
        relationship: 'Mentor',
        description: 'An old monk who occasionally visited your retreat',
        location: 'Mountain Monastery'
      },
      {
        name: 'The Pilgrim',
        relationship: 'Contact',
        description: 'A mysterious traveler who shared wisdom during your isolation',
        location: 'Unknown'
      }
    ],
    personalityTraits: [
      'I connect everything that happens to me to a grand, cosmic plan.',
      'I often get lost in my own thoughts and contemplation.',
      'I am working on a grand philosophical work that will revolutionize how people think.'
    ],
    ideals: [
      {
        name: 'Self-Knowledge',
        description: 'If you know yourself, there\'s nothing left to know.',
        alignment: 'Neutral'
      },
      {
        name: 'Free Thinking',
        description: 'Inquiry and curiosity are the pillars of progress.',
        alignment: 'Chaotic'
      }
    ],
    bonds: [
      'My isolation gave me great insight into a great evil that only I can destroy.',
      'My isolation was a spiritual experience that continues to guide me.',
      'I entered seclusion to hide from those who might still be hunting me.'
    ],
    flaws: [
      'Now that I\'ve returned to the world, I enjoy its delights a little too much.',
      'I harbor dark, bloodthirsty thoughts that my isolation failed to quell.',
      'I am dogmatic in my thinking and philosophy.'
    ],
    features: [
      {
        name: 'Discovery',
        description: 'Your seclusion led to a unique discovery about the universe, recorded in your philosophical work.',
        mechanicalBenefit: 'Possesses unique knowledge that others might value greatly'
      }
    ],
    typicalLocations: ['Remote Wilderness', 'Abandoned Ruins', 'Mountain Caves', 'Ancient Libraries'],
    motivations: [
      'Share discovered wisdom with world',
      'Find worthy successor for teachings',
      'Complete life\'s philosophical work',
      'Prevent foreseen catastrophe'
    ],
    rarity: 'Rare'
  }
];

/**
 * Seeds the database with origin data
 */
async function seedOrigins() {
  try {
    // Clear existing origin data
    await Origin.deleteMany({});
    console.log('Cleared existing origin data');
    
    // Insert new origin data
    const origins = await Origin.insertMany(originData);
    console.log(`✅ Created ${origins.length} origins:`);
    
    // Display each origin with key info
    origins.forEach(origin => {
      console.log(`\n📜 ${origin.name} (${origin.category})`);
      console.log(`   Social Standing: ${origin.socialStanding}`);
      console.log(`   Starting Wealth: ${origin.startingWealth.min}-${origin.startingWealth.max} MKS`);
      console.log(`   Skills: ${origin.skills.join(', ')}`);
      console.log(`   Abilities: ${origin.abilities.length}`);
      console.log(`   Connections: ${origin.connections.length}`);
    });
    
    // Category breakdown
    console.log('\n--- Origins by Category ---');
    const categoryCount = {};
    origins.forEach(origin => {
      categoryCount[origin.category] = (categoryCount[origin.category] || 0) + 1;
    });
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`${category}: ${count} origins`);
    });
    
    // Social standing breakdown
    console.log('\n--- Origins by Social Standing ---');
    const standingCount = {};
    origins.forEach(origin => {
      standingCount[origin.socialStanding] = (standingCount[origin.socialStanding] || 0) + 1;
    });
    Object.entries(standingCount).forEach(([standing, count]) => {
      console.log(`${standing}: ${count} origins`);
    });
    
    return origins;
    
  } catch (error) {
    console.error('❌ Error seeding origins:', error);
    throw error;
  }
}

// Export for use in other modules
module.exports = { seedOrigins, originData };

// If run directly, execute the seed
if (require.main === module) {
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('Connected to MongoDB');
      return seedOrigins();
    })
    .then(() => {
      console.log('Origin seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}