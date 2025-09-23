const mongoose = require('mongoose');
const Item = require('../models/Item');

/**
 * Seed data for Items
 */

const itemData = [
  // WEAPONS
  {
    name: 'Iron Sword',
    description: 'A well-balanced blade forged from quality iron. Reliable and effective in combat.',
    category: 'Weapon',
    subtype: 'One-Handed Sword',
    rarity: 'Common',
    baseValue: 25,
    weight: 3,
    equipSlot: 'MainHand',
    weaponType: 'Light',
    baseDamage: 6,
    damageType: 'Physical',
    requirements: [
      { type: 'STR', value: 3, description: 'Requires moderate strength to wield effectively' }
    ],
    tags: ['sword', 'melee', 'versatile']
  },
  
  {
    name: 'War Hammer',
    description: 'A massive two-handed hammer designed for crushing armor and bones alike.',
    category: 'Weapon',
    subtype: 'Two-Handed Hammer',
    rarity: 'Common',
    baseValue: 40,
    weight: 8,
    equipSlot: 'TwoHand',
    weaponType: 'Heavy',
    baseDamage: 10,
    damageType: 'Physical',
    requirements: [
      { type: 'STR', value: 4, description: 'Requires significant strength to wield' }
    ],
    tags: ['hammer', 'melee', 'two-handed', 'crushing']
  },
  
  {
    name: 'Elven Longbow',
    description: 'A masterwork bow carved from ancient heartwood, favored by elven rangers.',
    category: 'Weapon',
    subtype: 'Longbow',
    rarity: 'Uncommon',
    baseValue: 75,
    weight: 2,
    equipSlot: 'TwoHand',
    weaponType: 'Ranged',
    baseDamage: 7,
    damageType: 'Physical',
    requirements: [
      { type: 'DEX', value: 4, description: 'Requires exceptional dexterity' }
    ],
    bonuses: [
      { type: 'AttackBonus', value: 1, description: 'Masterwork construction grants +1 to attack rolls' }
    ],
    tags: ['bow', 'ranged', 'elven', 'masterwork']
  },
  
  {
    name: 'Staff of Flames',
    description: 'A gnarled staff topped with a fire opal that crackles with magical energy.',
    category: 'Weapon',
    subtype: 'Magical Staff',
    rarity: 'Rare',
    baseValue: 200,
    weight: 4,
    equipSlot: 'TwoHand',
    weaponType: 'Staff',
    baseDamage: 4,
    damageType: 'Fire',
    requirements: [
      { type: 'INT', value: 4, description: 'Requires magical knowledge to attune' }
    ],
    bonuses: [
      { type: 'Damage', value: 3, description: 'Fire magic enhances damage', condition: 'against flammable targets' }
    ],
    abilities: [
      {
        name: 'Flame Burst',
        description: 'Once per day, you can cast a flame burst spell dealing fire damage to all enemies within 10 feet.',
        uses: 1,
        rechargeType: 'daily',
        activationType: 'action'
      }
    ],
    tags: ['staff', 'magical', 'fire', 'spellcasting']
  },
  
  // ARMOR
  {
    name: 'Leather Armor',
    description: 'Supple leather armor that provides protection without restricting movement.',
    category: 'Armor',
    subtype: 'Light Armor',
    rarity: 'Common',
    baseValue: 15,
    weight: 5,
    equipSlot: 'Chest',
    armorClass: 2,
    armorType: 'Light',
    tags: ['armor', 'light', 'leather', 'flexible']
  },
  
  {
    name: 'Chain Mail',
    description: 'Interlocking metal rings provide solid protection against slashing attacks.',
    category: 'Armor',
    subtype: 'Medium Armor',
    rarity: 'Common',
    baseValue: 50,
    weight: 15,
    equipSlot: 'Chest',
    armorClass: 4,
    armorType: 'Medium',
    requirements: [
      { type: 'STR', value: 3, description: 'Requires strength to wear without penalty' }
    ],
    bonuses: [
      { type: 'Speed', value: -5, description: 'Heavy armor reduces movement speed' }
    ],
    tags: ['armor', 'medium', 'metal', 'chain']
  },
  
  {
    name: 'Dwarven Plate',
    description: 'Masterfully crafted plate armor bearing the runes of dwarven smiths.',
    category: 'Armor',
    subtype: 'Heavy Armor',
    rarity: 'Rare',
    baseValue: 300,
    weight: 25,
    equipSlot: 'Chest',
    armorClass: 7,
    armorType: 'Heavy',
    requirements: [
      { type: 'STR', value: 5, description: 'Requires exceptional strength to wear' }
    ],
    bonuses: [
      { type: 'Speed', value: -5, description: 'Heavy armor reduces movement speed' },
      { type: 'STR', value: 1, description: 'Dwarven craftsmanship enhances strength', condition: 'when worn' }
    ],
    abilities: [
      {
        name: 'Dwarven Resilience',
        description: 'Gain resistance to poison damage while wearing this armor.',
        activationType: 'passive'
      }
    ],
    craftable: true,
    craftingMaterials: [
      { materialName: 'Dwarven Steel', quantity: 5, description: 'Special alloy forged in dwarven forges' },
      { materialName: 'Runic Inscriptions', quantity: 1, description: 'Magical runes of protection' }
    ],
    craftingSkillRequired: 'Smithing',
    craftingDifficulty: 20,
    tags: ['armor', 'heavy', 'dwarven', 'masterwork', 'plate']
  },
  
  {
    name: 'Iron Shield',
    description: 'A sturdy round shield made of iron-reinforced wood.',
    category: 'Shield',
    rarity: 'Common',
    baseValue: 20,
    weight: 4,
    equipSlot: 'OffHand',
    armorClass: 1,
    armorType: 'Shield',
    bonuses: [
      { type: 'AC', value: 1, description: 'Shield grants additional armor class' }
    ],
    tags: ['shield', 'defensive', 'iron', 'round']
  },
  
  // CONSUMABLES
  {
    name: 'Healing Potion',
    description: 'A crimson liquid that glows with restorative magic. Tastes surprisingly sweet.',
    category: 'Consumable',
    subtype: 'Healing Potion',
    rarity: 'Common',
    baseValue: 25,
    weight: 0.5,
    stackable: true,
    maxStackSize: 5,
    consumable: true,
    consumeEffect: 'Restores 2d4+2 hit points immediately upon consumption.',
    abilities: [
      {
        name: 'Instant Healing',
        description: 'Restores hit points when consumed.',
        uses: 1,
        rechargeType: 'consumable',
        activationType: 'action'
      }
    ],
    craftable: true,
    craftingMaterials: [
      { materialName: 'Healing Herbs', quantity: 2, description: 'Fresh medicinal plants' },
      { materialName: 'Pure Water', quantity: 1, description: 'Clean, blessed water' }
    ],
    craftingSkillRequired: 'Alchemy',
    craftingDifficulty: 12,
    tags: ['potion', 'healing', 'consumable', 'magical']
  },
  
  {
    name: 'Mana Crystal',
    description: 'A glowing blue crystal that pulses with raw magical energy.',
    category: 'Consumable',
    subtype: 'Mana Restoration',
    rarity: 'Uncommon',
    baseValue: 50,
    weight: 0.5,
    stackable: true,
    maxStackSize: 3,
    consumable: true,
    consumeEffect: 'Restores 1d6+3 mana points immediately upon consumption.',
    abilities: [
      {
        name: 'Mana Restoration',
        description: 'Restores mana when consumed.',
        uses: 1,
        rechargeType: 'consumable',
        activationType: 'action'
      }
    ],
    discoveredIn: 'Deep underground caverns and magical laboratories',
    tags: ['crystal', 'mana', 'consumable', 'magical', 'rare']
  },
  
  // TOOLS
  {
    name: "Thieves' Tools",
    description: 'A collection of lockpicks, small mirrors, and other implements for bypassing security.',
    category: 'Tool',
    subtype: 'Criminal Tools',
    rarity: 'Common',
    baseValue: 25,
    weight: 2,
    abilities: [
      {
        name: 'Lockpicking',
        description: 'Grants proficiency bonus to lockpicking attempts.',
        activationType: 'passive'
      }
    ],
    requirements: [
      { type: 'Skill', value: 'legerdemain', description: 'Requires sleight of hand skill' }
    ],
    tags: ['tools', 'criminal', 'lockpicking', 'stealth']
  },
  
  {
    name: "Smith's Hammer",
    description: 'A heavy hammer specifically designed for metalworking and forging.',
    category: 'Tool',
    subtype: 'Crafting Tool',
    rarity: 'Common',
    baseValue: 15,
    weight: 3,
    abilities: [
      {
        name: 'Master Crafting',
        description: 'Grants advantage on smithing checks when crafting metal items.',
        activationType: 'passive'
      }
    ],
    craftable: true,
    craftingMaterials: [
      { materialName: 'Iron', quantity: 2, description: 'Quality iron for the hammer head' },
      { materialName: 'Hardwood', quantity: 1, description: 'Sturdy wood for the handle' }
    ],
    craftingSkillRequired: 'Smithing',
    craftingDifficulty: 10,
    tags: ['tools', 'smithing', 'crafting', 'metalwork']
  },
  
  // TREASURES
  {
    name: 'Ancient Gold Coin',
    description: 'A coin minted in the era before the Mad King, bearing the likeness of a forgotten ruler.',
    category: 'Treasure',
    subtype: 'Currency',
    rarity: 'Uncommon',
    baseValue: 100,
    weight: 0.1,
    stackable: true,
    maxStackSize: 50,
    lore: 'These coins are highly valued by collectors and scholars for their historical significance.',
    discoveredIn: 'Ancient ruins and forgotten treasure hoards',
    tags: ['treasure', 'currency', 'ancient', 'valuable', 'historical']
  },
  
  {
    name: 'Ruby of the Mad King',
    description: 'A blood-red ruby that seems to pulse with an inner darkness. It whispers of power and madness.',
    category: 'Treasure',
    subtype: 'Cursed Gem',
    rarity: 'Legendary',
    baseValue: 5000,
    weight: 0.5,
    bonuses: [
      { type: 'CHA', value: 2, description: 'The gem enhances your presence and persuasive power' },
      { type: 'Mana', value: 10, description: 'Grants additional magical energy' }
    ],
    abilities: [
      {
        name: 'Madness Whispers',
        description: 'Once per day, you can attempt to drive a target temporarily insane with whispered madness.',
        uses: 1,
        rechargeType: 'daily',
        activationType: 'action'
      },
      {
        name: 'Cursed Burden',
        description: 'The bearer occasionally hears whispers of the Mad King and must make wisdom saves or be compelled to act erratically.',
        activationType: 'passive'
      }
    ],
    lore: 'Legend says this gem was torn from the Mad King\'s crown when he fell to madness. It carries a fragment of his tormented soul.',
    discoveredIn: 'The Mad King\'s former palace, now a twisted ruin',
    tags: ['treasure', 'gem', 'cursed', 'legendary', 'mad-king', 'dangerous']
  }
];

/**
 * Seeds the database with item data
 */
async function seedItems() {
  try {
    // Clear existing item data
    await Item.deleteMany({});
    console.log('Cleared existing item data');
    
    // Insert new item data
    const items = await Item.insertMany(itemData);
    console.log(`✅ Created ${items.length} items:`);
    
    // Group items by category for summary
    const itemsByCategory = {};
    items.forEach(item => {
      if (!itemsByCategory[item.category]) {
        itemsByCategory[item.category] = [];
      }
      itemsByCategory[item.category].push(item.name);
    });
    
    // Display summary
    Object.entries(itemsByCategory).forEach(([category, itemNames]) => {
      console.log(`\n${category} (${itemNames.length} items):`);
      itemNames.forEach(name => console.log(`   - ${name}`));
    });
    
    // Rarity breakdown
    console.log('\nItems by Rarity:');
    const rarityCount = {};
    items.forEach(item => {
      rarityCount[item.rarity] = (rarityCount[item.rarity] || 0) + 1;
    });
    Object.entries(rarityCount).forEach(([rarity, count]) => {
      console.log(`   ${rarity}: ${count} items`);
    });
    
    return items;
    
  } catch (error) {
    console.error('❌ Error seeding items:', error);
    throw error;
  }
}

// Export for use in other modules
module.exports = { seedItems, itemData };

// If run directly, execute the seed
if (require.main === module) {
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/madking-rpg', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => {
      console.log('Connected to MongoDB');
      return seedItems();
    })
    .then(() => {
      console.log('Item seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}