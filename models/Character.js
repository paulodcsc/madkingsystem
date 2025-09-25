const mongoose = require('mongoose');

/**
 * Character Sheet data model for RPG characters using Mongoose
 * Features level-based progression, stat calculations, and ability access
 */

// Schema for character skills
const CharacterSkillsSchema = new mongoose.Schema({
  // Strength-based skills
  heavyWeapons: { type: Boolean, default: false },
  muscle: { type: Boolean, default: false },
  athletics: { type: Boolean, default: false },
  endurance: { type: Boolean, default: false },
  
  // Dexterity-based skills
  lightWeapons: { type: Boolean, default: false },
  rangedWeapons: { type: Boolean, default: false },
  stealth: { type: Boolean, default: false },
  acrobatics: { type: Boolean, default: false },
  legerdemain: { type: Boolean, default: false },
  
  // Charisma-based skills
  negotiation: { type: Boolean, default: false },
  deception: { type: Boolean, default: false },
  intimidation: { type: Boolean, default: false },
  seduction: { type: Boolean, default: false },
  
  // Intelligence-based skills
  arcana: { type: Boolean, default: false },
  lore: { type: Boolean, default: false },
  investigation: { type: Boolean, default: false },
  nature: { type: Boolean, default: false },
  insight: { type: Boolean, default: false }
}, { _id: false });

// Schema for character stats
const CharacterStatsSchema = new mongoose.Schema({
  str: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 10, 
    default: 1 
  },
  dex: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 10, 
    default: 1 
  },
  int: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 10, 
    default: 1 
  },
  cha: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 10, 
    default: 1 
  }
}, { _id: false });

// Schema for character items (simplified reference)
const CharacterItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  equipped: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Schema for equipped slots
const EquippedSlotsSchema = new mongoose.Schema({
  mainHand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null
  },
  offHand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null
  },
  chest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null
  },
  boots: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null
  },
  gloves: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null
  },
  headgear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null
  },
  cape: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null
  },
  necklace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null
  },
  ring: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null
  },
  other: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null
  }
}, { _id: false });

// Main Character Schema
const CharacterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Character name is required'],
    trim: true,
    maxlength: [100, 'Character name cannot exceed 100 characters']
  },
  
  // References to other models
  race: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Race',
    required: [true, 'Character race is required']
  },
  
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Character class is required']
  },
  
  origin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Origin',
    required: [true, 'Character origin is required']
  },
  
  subclass: {
    type: String,
    default: null,
    trim: true
  },
  
  spells: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spell'
  }],
  
  items: [CharacterItemSchema],
  
  // Equipment slots for equipped items
  equippedSlots: {
    type: EquippedSlotsSchema,
    default: () => ({})
  },
  
  // Character progression
  level: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10,
    default: 1
  },
  
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Core stats
  stats: {
    type: CharacterStatsSchema,
    required: true,
    default: () => ({})
  },
  
  // Health and resources
  hp: { 
    type: Number, 
    min: 1
  },
  
  maxHp: { 
    type: Number, 
    min: 1
  },
  
  mana: { 
    type: Number, 
    default: null
  },
  
  maxMana: { 
    type: Number, 
    default: null
  },
  
  // Armor Class
  baseAC: { 
    type: Number, 
    required: true,
    default: 10
  },
  
  // Speed
  baseSpeed: { 
    type: Number, 
    required: true,
    default: 30
  },
  
  speedModifiers: [{
    source: { type: String, required: true },
    value: { type: Number, required: true },
    description: { type: String, default: '' }
  }],
  
  // Skills and proficiencies
  skills: {
    type: CharacterSkillsSchema,
    required: true,
    default: () => ({})
  },
  
  extraSkills: [{
    type: String,
    enum: [
      'heavyWeapons', 'muscle', 'athletics', 'endurance',
      'lightWeapons', 'rangedWeapons', 'stealth', 'acrobatics', 'legerdemain',
      'negotiation', 'deception', 'intimidation', 'seduction',
      'arcana', 'lore', 'investigation', 'nature', 'insight'
    ]
  }],
  
  // Equipment
  // Note: AC is now calculated from equipped items, no separate armor field needed
  
  // Character background
  backstory: {
    type: String,
    default: '',
    trim: true,
    maxlength: [5000, 'Backstory cannot exceed 5000 characters']
  },
  
  // Currency
  currency: {
    type: Number,
    default: 0,
    min: 0
  }
  
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields for calculated values
CharacterSchema.virtual('statModifiers').get(function() {
  return {
    str: this.stats.str, // 1=+1, 2=+2, 3=+3, etc.
    dex: this.stats.dex,
    int: this.stats.int,
    cha: this.stats.cha
  };
});

CharacterSchema.virtual('proficiencyBonus').get(function() {
  return Math.ceil(this.level / 2) + 1; // Level 1-2: +2, 3-4: +3, 5-6: +4, 7-8: +5, 9-10: +6
});

CharacterSchema.virtual('totalAC').get(function() {
  let totalAC = this.baseAC;
  
  // Add AC bonuses from equipped items via equipped slots
  const slotTypes = ['mainHand', 'offHand', 'chest', 'boots', 'gloves', 'headgear', 'cape', 'necklace', 'ring', 'other'];
  
  slotTypes.forEach(slotType => {
    const equippedItem = this.equippedSlots?.[slotType];
    if (equippedItem && equippedItem.bonuses && Array.isArray(equippedItem.bonuses)) {
      equippedItem.bonuses.forEach(bonus => {
        if (bonus.type === 'AC') {
          totalAC += bonus.value;
        }
      });
    }
  });
  
  return totalAC;
});

CharacterSchema.virtual('totalSpeed').get(function() {
  const modifiers = this.speedModifiers.reduce((total, mod) => total + mod.value, 0);
  return this.baseSpeed + modifiers;
});

// Instance methods
CharacterSchema.methods.getStatModifier = function(statName) {
  const statValue = this.stats[statName];
  if (!statValue) return 0;
  return statValue; // 1=+1, 2=+2, 3=+3, etc.
};

CharacterSchema.methods.hasSkillProficiency = function(skillName) {
  return this.skills[skillName] || this.extraSkills.includes(skillName);
};

CharacterSchema.methods.getSkillModifier = function(skillName) {
  // Map skills to their governing stats
  const skillStatMap = {
    // Strength skills
    heavyWeapons: 'str', muscle: 'str', athletics: 'str', endurance: 'str',
    // Dexterity skills  
    lightWeapons: 'dex', rangedWeapons: 'dex', stealth: 'dex', acrobatics: 'dex', legerdemain: 'dex',
    // Charisma skills
    negotiation: 'cha', deception: 'cha', intimidation: 'cha', seduction: 'cha',
    // Intelligence skills
    arcana: 'int', lore: 'int', investigation: 'int', nature: 'int', insight: 'int'
  };
  
  const governingStat = skillStatMap[skillName];
  if (!governingStat) return 0;
  
  const statModifier = this.getStatModifier(governingStat);
  const proficiencyBonus = this.hasSkillProficiency(skillName) ? this.proficiencyBonus : 0;
  
  return statModifier + proficiencyBonus;
};

CharacterSchema.methods.calculateTotalAC = async function() {
  let totalAC = this.baseAC;
  
  // Populate equipped slots if not already populated
  const slotTypes = ['mainHand', 'offHand', 'chest', 'boots', 'gloves', 'headgear', 'cape', 'necklace', 'ring', 'other'];
  const needsPopulation = slotTypes.some(slotType => {
    const equippedItem = this.equippedSlots?.[slotType];
    return equippedItem && !equippedItem.bonuses;
  });
  
  if (needsPopulation) {
    try {
      await this.populate(slotTypes.map(slot => `equippedSlots.${slot}`));
    } catch (error) {
      console.warn('Could not populate equipped slots:', error.message);
    }
  }
  
  // Add AC bonuses from equipped items
  slotTypes.forEach(slotType => {
    const equippedItem = this.equippedSlots?.[slotType];
    if (equippedItem && equippedItem.bonuses && Array.isArray(equippedItem.bonuses)) {
      equippedItem.bonuses.forEach(bonus => {
        if (bonus.type === 'AC') {
          totalAC += bonus.value;
        }
      });
    }
  });
  
  return totalAC;
};

CharacterSchema.methods.rollSkillCheck = function(skillName) {
  const d20Roll = Math.floor(Math.random() * 20) + 1;
  const modifier = this.getSkillModifier(skillName);
  return {
    roll: d20Roll,
    modifier: modifier,
    total: d20Roll + modifier,
    skill: skillName,
    isProficient: this.hasSkillProficiency(skillName)
  };
};

// Method to calculate HP for current level
CharacterSchema.methods.calculateMaxHp = async function() {
  if (!this.class) return 10; // Base HP if no class
  
  let classDoc = this.class;
  if (typeof this.class === 'string' || this.class.constructor === mongoose.Types.ObjectId) {
    classDoc = await mongoose.model('Class').findById(this.class);
  }
  
  if (!classDoc) return 10;
  
  // Simple calculation: level × class HP bonus per level
  return Math.max(1, this.level * classDoc.hpBonusPerLevel);
};

// Method to calculate Mana for current level
CharacterSchema.methods.calculateMaxMana = async function() {
  if (!this.class) return null;
  
  let classDoc = this.class;
  if (typeof this.class === 'string' || this.class.constructor === mongoose.Types.ObjectId) {
    classDoc = await mongoose.model('Class').findById(this.class);
  }
  
  if (!classDoc || classDoc.manaBonusPerLevel === 0) return null;
  
  // Simple calculation: level × class mana bonus per level
  return Math.max(0, this.level * classDoc.manaBonusPerLevel);
};

// Method to get available spells for current level
CharacterSchema.methods.getAvailableSpells = async function() {
  await this.populate('spells');
  
  if (!this.spells || this.spells.length === 0) return [];
  
  // Filter spells by character's available spell circles based on level
  const maxSpellCircle = Math.min(5, Math.ceil(this.level / 2)); // Level 1-2: Circle 1, 3-4: Circle 2, etc.
  
  return this.spells.filter(spell => spell.circle <= maxSpellCircle);
};

// Method to get available abilities for current level
CharacterSchema.methods.getAvailableAbilities = async function() {
  await this.populate(['class', 'race', 'origin']);
  
  const abilities = [];
  
  // Class abilities (odd levels)
  if (this.class && this.class.abilities) {
    const classAbilities = this.class.abilities.filter(ability => 
      ability.level <= this.level && ability.level % 2 === 1
    ).map(ability => ({
      ...ability.toObject(),
      source: 'class'
    }));
    abilities.push(...classAbilities);
  }
  
  // Subclass abilities (even levels)
  if (this.class && this.subclass && this.class.subclasses) {
    const subclassData = this.class.subclasses.find(sc => sc.name === this.subclass);
    if (subclassData && subclassData.abilities) {
      const subclassAbilities = subclassData.abilities.filter(ability => 
        ability.level <= this.level && ability.level % 2 === 0
      ).map(ability => ({
        ...ability.toObject(),
        source: 'subclass'
      }));
      abilities.push(...subclassAbilities);
    }
  }
  
  // Racial abilities
  if (this.race && this.race.abilities) {
    const racialAbilities = this.race.abilities.filter(ability => 
      ability.level <= this.level
    ).map(ability => ({
      ...ability.toObject(),
      source: 'race'
    }));
    abilities.push(...racialAbilities);
  }
  
  // Origin abilities
  if (this.origin && this.origin.abilities) {
    const originAbilities = this.origin.abilities.filter(ability => 
      ability.level <= this.level
    ).map(ability => ({
      ...ability.toObject(),
      source: 'origin'
    }));
    abilities.push(...originAbilities);
  }
  
  // Sort by level, then by source
  return abilities.sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    const sourceOrder = { race: 1, origin: 2, class: 3, subclass: 4 };
    return sourceOrder[a.source] - sourceOrder[b.source];
  });
};

// Method to level up character
CharacterSchema.methods.levelUp = async function() {
  if (this.level >= 10) {
    throw new Error('Character is already at maximum level (10)');
  }
  
  this.level += 1;
  
  // Recalculate HP and Mana
  this.maxHp = await this.calculateMaxHp();
  this.hp = Math.min(this.hp + 5, this.maxHp); // Gain some HP on level up but don't exceed max
  
  const newMaxMana = await this.calculateMaxMana();
  if (newMaxMana !== null) {
    this.maxMana = newMaxMana;
    this.mana = Math.min((this.mana || 0) + Math.ceil(newMaxMana / 10), this.maxMana);
  }
  
  return this;
};

// Method to equip an item
CharacterSchema.methods.equipItem = async function(itemId, preferredSlot = null) {
  // Find the item in character's inventory
  const inventoryItem = this.items.find(item => item.item.toString() === itemId.toString());
  if (!inventoryItem) {
    throw new Error('Item not found in character inventory');
  }
  
  // Get the item details
  let itemDoc = inventoryItem.item;
  if (typeof itemDoc === 'string' || itemDoc.constructor === mongoose.Types.ObjectId) {
    itemDoc = await mongoose.model('Item').findById(itemDoc);
  }
  
  if (!itemDoc) {
    throw new Error('Item not found');
  }
  
  // Check if item has a slot type (is equipable)
  if (!itemDoc.slotType) {
    throw new Error('Item is not equipable');
  }
  
  // Get weapon hand requirements
  const handReq = itemDoc.getHandRequirement();
  let slotsToEquip = [];
  
  // Determine which slot(s) to use
  if (itemDoc.category === 'Weapon' || itemDoc.category === 'Shield') {
    if (handReq.hands === 2) {
      // Two-handed weapon - needs both hands
      slotsToEquip = ['mainHand', 'offHand'];
      
      // Check if both hands are available or can be cleared
      if (this.equippedSlots.mainHand) {
        await this.unequipItem(this.equippedSlots.mainHand);
      }
      if (this.equippedSlots.offHand) {
        await this.unequipItem(this.equippedSlots.offHand);
      }
      
      // Equip in main hand (the off-hand slot will point to the same item for two-handed weapons)
      this.equippedSlots.mainHand = itemDoc._id;
      this.equippedSlots.offHand = itemDoc._id;
      
    } else if (handReq.canMainHand && handReq.canOffHand) {
      // One-handed weapon - can go in either slot, prefer specified slot or main hand
      const targetSlot = preferredSlot && ['mainHand', 'offHand'].includes(preferredSlot) ? preferredSlot : 'mainHand';
      
      if (this.equippedSlots[targetSlot]) {
        await this.unequipItem(this.equippedSlots[targetSlot]);
      }
      
      this.equippedSlots[targetSlot] = itemDoc._id;
      
    } else if (handReq.canOffHand && !handReq.canMainHand) {
      // Off-hand only (shields, parrying daggers)
      if (this.equippedSlots.offHand) {
        await this.unequipItem(this.equippedSlots.offHand);
      }
      
      this.equippedSlots.offHand = itemDoc._id;
      
    } else {
      throw new Error('Cannot determine how to equip this weapon');
    }
    
  } else {
    // Non-weapon items use their slot type directly
    const slotType = itemDoc.slotType;
    
    if (this.equippedSlots[slotType]) {
      await this.unequipItem(this.equippedSlots[slotType]);
    }
    
    this.equippedSlots[slotType] = itemDoc._id;
  }
  
  inventoryItem.equipped = true;
  
  return this;
};

// Method to unequip an item
CharacterSchema.methods.unequipItem = async function(itemId) {
  // Find which slot(s) the item is in
  const slotTypes = ['mainHand', 'offHand', 'chest', 'boots', 'gloves', 'headgear', 'cape', 'necklace', 'ring', 'other'];
  const slotsWithItem = [];
  
  for (const slot of slotTypes) {
    if (this.equippedSlots[slot] && this.equippedSlots[slot].toString() === itemId.toString()) {
      slotsWithItem.push(slot);
    }
  }
  
  if (slotsWithItem.length === 0) {
    throw new Error('Item is not equipped');
  }
  
  // Get the item to check if it's a two-handed weapon
  let itemDoc = await mongoose.model('Item').findById(itemId);
  if (itemDoc && itemDoc.getHandRequirement().hands === 2) {
    // Two-handed weapon - clear both hands
    this.equippedSlots.mainHand = null;
    this.equippedSlots.offHand = null;
  } else {
    // Remove from all slots where it's equipped
    for (const slot of slotsWithItem) {
      this.equippedSlots[slot] = null;
    }
  }
  
  // Update inventory item
  const inventoryItem = this.items.find(item => item.item.toString() === itemId.toString());
  if (inventoryItem) {
    inventoryItem.equipped = false;
  }
  
  return this;
};

// Pre-save middleware to calculate HP and Mana
CharacterSchema.pre('save', async function(next) {
  try {
    // Always calculate maxHp and maxMana
    this.maxHp = await this.calculateMaxHp();
    
    const maxMana = await this.calculateMaxMana();
    this.maxMana = maxMana;
    
    // Set HP to maxHp if it's not set or if it's a new character
    if (this.isNew || this.hp === undefined || this.hp === null) {
      this.hp = this.maxHp;
    } else if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
    
    // Set Mana if character has mana
    if (maxMana !== null) {
      if (this.isNew || this.mana === null || this.mana === undefined) {
        this.mana = maxMana;
      } else if (this.mana > maxMana) {
        this.mana = maxMana;
      }
    } else {
      this.mana = null;
    }
  } catch (error) {
    return next(error);
  }
  next();
});

// Indexes for better performance
CharacterSchema.index({ name: 1 });
CharacterSchema.index({ level: 1 });
CharacterSchema.index({ class: 1 });
CharacterSchema.index({ race: 1 });
CharacterSchema.index({ createdAt: -1 });

// Create and export the model
const Character = mongoose.model('Character', CharacterSchema);

module.exports = Character;