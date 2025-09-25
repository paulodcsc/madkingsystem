const mongoose = require('mongoose');

/**
 * Item data model for RPG items, equipment, and consumables using Mongoose
 */

// Schema for item bonuses/effects
const ItemBonusSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['STR', 'DEX', 'INT', 'CHA', 'HP', 'Mana', 'AC', 'Speed', 'Damage', 'AttackBonus'],
    trim: true 
  },
  value: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    default: '', 
    trim: true 
  },
  condition: {
    type: String,
    default: '', // e.g., 'when equipped', 'when consumed', 'when wielded'
    trim: true
  }
}, { _id: false });

// Schema for item requirements
const ItemRequirementSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['STR', 'DEX', 'INT', 'CHA', 'Level', 'Class', 'Race', 'Skill'],
    trim: true
  },
  value: { // For stats/level, this is the minimum value. For class/race/skill, this is the name
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  }
}, { _id: false });

// Schema for item abilities/special effects
const ItemAbilitySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },
  uses: {
    type: Number,
    default: null, // null means unlimited uses
    min: 0
  },
  rechargeType: {
    type: String,
    enum: ['daily', 'short-rest', 'long-rest', 'manual', 'consumable', 'permanent'],
    default: 'permanent'
  },
  activationType: {
    type: String,
    enum: ['passive', 'action', 'bonus-action', 'reaction', 'free'],
    default: 'passive'
  }
}, { _id: false });

// Main Item Schema
const ItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Item name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  
  description: { 
    type: String, 
    required: [true, 'Item description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Item category and type
  category: {
    type: String,
    required: true,
    enum: [
      'Weapon', 'Armor', 'Shield', 'Consumable', 'Tool', 'Treasure', 
      'Quest', 'Material', 'Container', 'Miscellaneous'
    ],
    default: 'Miscellaneous'
  },
  
  // Equipment slot type for equipable items
  slotType: {
    type: String,
    enum: [
      'mainHand', 'offHand', 'chest', 'boots', 'gloves', 'headgear', 
      'cape', 'necklace', 'ring', 'other', null
    ],
    default: null,
    validate: {
      validator: function(value) {
        // Only certain categories should have slot types
        const equipableCategories = ['Weapon', 'Armor', 'Shield'];
        if (equipableCategories.includes(this.category)) {
          return value !== null && value !== undefined;
        }
        return true; // Non-equipable items can have null slot type
      },
      message: 'Equipable items must have a slot type'
    }
  },
  
  // Weapon handling for weapons - how they use hand slots
  weaponHandling: {
    type: String,
    enum: ['one-handed', 'two-handed', 'off-hand-only', null],
    default: null,
    validate: {
      validator: function(value) {
        // Only weapons should have weapon handling
        if (this.category === 'Weapon') {
          return value !== null && value !== undefined;
        }
        if (this.category === 'Shield') {
          // Shields are always off-hand-only
          return value === 'off-hand-only' || value === null;
        }
        return value === null; // Non-weapons shouldn't have weapon handling
      },
      message: 'Only weapons and shields should have weapon handling specified'
    }
  },
  
  subtype: {
    type: String,
    default: '',
    trim: true,
    maxlength: [50, 'Subtype cannot exceed 50 characters']
    // Examples: 'Heavy Weapon', 'Light Armor', 'Potion', 'Lockpick', etc.
  },
  
  // Item rarity and value
  rarity: {
    type: String,
    required: true,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Artifact'],
    default: 'Common'
  },
  
  baseValue: {
    type: Number,
    required: true,
    min: [0, 'Base value cannot be negative'],
    default: 1
  },
  
  // Physical properties
  weight: {
    type: Number,
    default: 1,
    min: [0, 'Weight cannot be negative']
  },
  
  stackable: {
    type: Boolean,
    default: false
  },
  
  maxStackSize: {
    type: Number,
    default: 1,
    min: [1, 'Max stack size must be at least 1']
  },
  
  // Durability system
  maxDurability: {
    type: Number,
    default: null, // null means item doesn't degrade
    min: 1
  },
  
  // Equipment properties
  equipSlot: {
    type: String,
    enum: ['', 'MainHand', 'OffHand', 'TwoHand', 'Head', 'Chest', 'Legs', 'Feet', 'Hands', 'Ring', 'Neck', 'Back'],
    default: ''
  },
  
  // Weapon properties
  weaponType: {
    type: String,
    enum: ['', 'Heavy', 'Light', 'Ranged', 'Staff', 'Wand'],
    default: ''
  },
  
  baseDamage: {
    type: Number,
    default: 0,
    min: [0, 'Base damage cannot be negative']
  },
  
  damageType: {
    type: String,
    enum: ['', 'Physical', 'Magical', 'Fire', 'Ice', 'Lightning', 'Poison', 'Necrotic', 'Radiant'],
    default: ''
  },
  
  // Armor properties
  armorClass: {
    type: Number,
    default: 0,
    min: [0, 'Armor class cannot be negative']
  },
  
  armorType: {
    type: String,
    enum: ['', 'Light', 'Medium', 'Heavy', 'Shield'],
    default: ''
  },
  
  // Consumable properties
  consumable: {
    type: Boolean,
    default: false
  },
  
  consumeEffect: {
    type: String,
    default: '',
    trim: true,
    maxlength: [500, 'Consume effect cannot exceed 500 characters']
  },
  
  // Item requirements
  requirements: [ItemRequirementSchema],
  
  // Item bonuses and effects
  bonuses: [ItemBonusSchema],
  
  // Special abilities
  abilities: [ItemAbilitySchema],
  
  // Crafting and materials
  craftable: {
    type: Boolean,
    default: false
  },
  
  craftingMaterials: [{
    materialName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    description: { type: String, default: '', trim: true }
  }],
  
  craftingSkillRequired: {
    type: String,
    enum: ['', 'Smithing', 'Alchemy', 'Enchanting', 'Tailoring', 'Carpentry'],
    default: ''
  },
  
  craftingDifficulty: {
    type: Number,
    default: 10,
    min: [5, 'Crafting difficulty must be at least 5'],
    max: [25, 'Crafting difficulty cannot exceed 25']
  },
  
  // Lore and flavor
  lore: {
    type: String,
    default: '',
    trim: true,
    maxlength: [1000, 'Lore cannot exceed 1000 characters']
  },
  
  discoveredIn: {
    type: String,
    default: '',
    trim: true // Where this item is typically found
  },
  
  // Tags for categorization and searching
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
  
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  versionKey: false, // Remove __v field
  toJSON: { virtuals: true }, // Include virtuals in JSON output
  toObject: { virtuals: true }
});

// Virtual fields
ItemSchema.virtual('isWeapon').get(function() {
  return this.category === 'Weapon';
});

ItemSchema.virtual('isArmor').get(function() {
  return this.category === 'Armor' || this.category === 'Shield';
});

ItemSchema.virtual('isEquippable').get(function() {
  return this.equipSlot !== '';
});

ItemSchema.virtual('isConsumable').get(function() {
  return this.consumable || this.category === 'Consumable';
});

ItemSchema.virtual('isMagical').get(function() {
  return this.rarity !== 'Common' || this.abilities.length > 0 || this.bonuses.length > 0;
});

ItemSchema.virtual('totalBonuses').get(function() {
  return this.bonuses.length;
});

ItemSchema.virtual('totalAbilities').get(function() {
  return this.abilities.length;
});

ItemSchema.virtual('hasRequirements').get(function() {
  return this.requirements.length > 0;
});

ItemSchema.virtual('effectiveValue').get(function() {
  // Calculate value based on rarity multiplier
  const rarityMultipliers = {
    'Common': 1,
    'Uncommon': 3,
    'Rare': 10,
    'Epic': 50,
    'Legendary': 200,
    'Artifact': 1000
  };
  
  return this.baseValue * (rarityMultipliers[this.rarity] || 1);
});

// Instance methods
ItemSchema.methods.canEquip = function(character) {
  if (!this.isEquippable) {
    return { canEquip: false, reason: 'Item is not equippable' };
  }
  
  // Check requirements
  for (const req of this.requirements) {
    switch (req.type) {
      case 'STR':
      case 'DEX':
      case 'INT':
      case 'CHA':
        const statValue = character.stats[req.type.toLowerCase()];
        if (statValue < req.value) {
          return { canEquip: false, reason: `Requires ${req.type} ${req.value}, have ${statValue}` };
        }
        break;
      case 'Level':
        if (character.level < req.value) {
          return { canEquip: false, reason: `Requires level ${req.value}, currently level ${character.level}` };
        }
        break;
      case 'Class':
        if (character.class.name !== req.value) {
          return { canEquip: false, reason: `Requires class: ${req.value}` };
        }
        break;
      case 'Race':
        if (character.race.name !== req.value) {
          return { canEquip: false, reason: `Requires race: ${req.value}` };
        }
        break;
      case 'Skill':
        if (!character.skills[req.value]) {
          return { canEquip: false, reason: `Requires skill proficiency: ${req.value}` };
        }
        break;
    }
  }
  
  return { canEquip: true };
};

// New method to check weapon hand requirements
ItemSchema.methods.getHandRequirement = function() {
  if (this.category === 'Weapon') {
    switch (this.weaponHandling) {
      case 'one-handed':
        return { hands: 1, canMainHand: true, canOffHand: true };
      case 'two-handed':
        return { hands: 2, canMainHand: true, canOffHand: false };
      case 'off-hand-only':
        return { hands: 1, canMainHand: false, canOffHand: true };
      default:
        return { hands: 1, canMainHand: true, canOffHand: true }; // Default to one-handed
    }
  }
  
  if (this.category === 'Shield') {
    return { hands: 1, canMainHand: false, canOffHand: true };
  }
  
  return { hands: 0, canMainHand: false, canOffHand: false }; // Not a weapon or shield
};

// Method to check if this item can be equipped in a specific slot
ItemSchema.methods.canEquipInSlot = function(slotName) {
  const handReq = this.getHandRequirement();
  
  if (slotName === 'mainHand') {
    return handReq.canMainHand;
  }
  
  if (slotName === 'offHand') {
    return handReq.canOffHand;
  }
  
  // For other slots, check if slotType matches
  return this.slotType === slotName;
};

// Method to get all compatible slots for this item
ItemSchema.methods.getCompatibleSlots = function() {
  const slots = [];
  const handReq = this.getHandRequirement();
  
  if (handReq.canMainHand) {
    slots.push('mainHand');
  }
  
  if (handReq.canOffHand) {
    slots.push('offHand');
  }
  
  // Add non-hand slots
  if (this.slotType && !['mainHand', 'offHand'].includes(this.slotType)) {
    slots.push(this.slotType);
  }
  
  return slots;
};

ItemSchema.methods.getBonusByType = function(bonusType) {
  return this.bonuses.filter(bonus => bonus.type === bonusType);
};

ItemSchema.methods.getTotalBonusValue = function(bonusType) {
  const bonuses = this.getBonusByType(bonusType);
  return bonuses.reduce((total, bonus) => total + bonus.value, 0);
};

ItemSchema.methods.getAbilitiesByActivation = function(activationType) {
  return this.abilities.filter(ability => ability.activationType === activationType);
};

ItemSchema.methods.getPassiveAbilities = function() {
  return this.getAbilitiesByActivation('passive');
};

ItemSchema.methods.getActiveAbilities = function() {
  return this.abilities.filter(ability => ability.activationType !== 'passive');
};

ItemSchema.methods.canCraft = function(character, materials = []) {
  if (!this.craftable) {
    return { canCraft: false, reason: 'Item is not craftable' };
  }
  
  // Check skill requirement
  if (this.craftingSkillRequired && !character.skills[this.craftingSkillRequired.toLowerCase()]) {
    return { canCraft: false, reason: `Requires ${this.craftingSkillRequired} skill` };
  }
  
  // Check materials (simplified - would need actual inventory system)
  for (const requiredMaterial of this.craftingMaterials) {
    const availableMaterial = materials.find(m => m.name === requiredMaterial.materialName);
    if (!availableMaterial || availableMaterial.quantity < requiredMaterial.quantity) {
      return { 
        canCraft: false, 
        reason: `Insufficient materials: need ${requiredMaterial.quantity} ${requiredMaterial.materialName}` 
      };
    }
  }
  
  return { canCraft: true };
};

ItemSchema.methods.calculateCraftingSuccess = function(character, skillRoll) {
  const targetDC = this.craftingDifficulty;
  const skillModifier = character.getSkillModifier(this.craftingSkillRequired.toLowerCase());
  const totalRoll = skillRoll + skillModifier;
  
  return {
    success: totalRoll >= targetDC,
    roll: skillRoll,
    modifier: skillModifier,
    total: totalRoll,
    targetDC: targetDC,
    margin: totalRoll - targetDC
  };
};

ItemSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
  return this;
};

ItemSchema.methods.removeTag = function(tag) {
  const index = this.tags.indexOf(tag);
  if (index > -1) {
    this.tags.splice(index, 1);
  }
  return this;
};

ItemSchema.methods.hasTag = function(tag) {
  return this.tags.includes(tag);
};

// Static methods
ItemSchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

ItemSchema.statics.findByCategory = function(category) {
  return this.find({ category: category });
};

ItemSchema.statics.findByRarity = function(rarity) {
  return this.find({ rarity: rarity });
};

ItemSchema.statics.findWeapons = function(weaponType = null) {
  const query = { category: 'Weapon' };
  if (weaponType) {
    query.weaponType = weaponType;
  }
  return this.find(query);
};

ItemSchema.statics.findArmor = function(armorType = null) {
  const query = { $or: [{ category: 'Armor' }, { category: 'Shield' }] };
  if (armorType) {
    query.armorType = armorType;
  }
  return this.find(query);
};

ItemSchema.statics.findConsumables = function() {
  return this.find({ 
    $or: [
      { category: 'Consumable' },
      { consumable: true }
    ]
  });
};

ItemSchema.statics.findCraftable = function() {
  return this.find({ craftable: true });
};

ItemSchema.statics.findByTag = function(tag) {
  return this.find({ tags: tag });
};

ItemSchema.statics.findByValueRange = function(minValue, maxValue) {
  return this.find({ 
    baseValue: { 
      $gte: minValue, 
      $lte: maxValue 
    } 
  });
};

ItemSchema.statics.findMagical = function() {
  return this.find({
    $or: [
      { rarity: { $ne: 'Common' } },
      { 'abilities.0': { $exists: true } },
      { 'bonuses.0': { $exists: true } }
    ]
  });
};

ItemSchema.statics.findByRequirement = function(requirementType, requirementValue) {
  return this.find({
    'requirements.type': requirementType,
    'requirements.value': requirementValue
  });
};

// Pre-save middleware
ItemSchema.pre('save', function(next) {
  // Ensure stackable items have appropriate max stack size
  if (this.stackable && this.maxStackSize === 1) {
    this.maxStackSize = 99; // Default stack size for stackable items
  }
  
  // Ensure non-stackable items have max stack size of 1
  if (!this.stackable && this.maxStackSize > 1) {
    this.maxStackSize = 1;
  }
  
  // Sort tags alphabetically
  this.tags.sort();
  
  // Remove duplicate tags
  this.tags = [...new Set(this.tags)];
  
  // Auto-assign weapon category for items with weaponType
  if (this.weaponType && this.weaponType !== '' && this.category !== 'Weapon') {
    this.category = 'Weapon';
  }
  
  // Auto-assign armor category for items with armorType
  if (this.armorType && this.armorType !== '' && !['Armor', 'Shield'].includes(this.category)) {
    this.category = this.armorType === 'Shield' ? 'Shield' : 'Armor';
  }
  
  // Auto-assign weapon handling based on weapon type and category
  if (this.category === 'Weapon' && !this.weaponHandling) {
    // Auto-assign weapon handling based on weapon type
    switch (this.weaponType) {
      case 'Heavy':
        this.weaponHandling = 'two-handed';
        this.slotType = 'mainHand';
        break;
      case 'Light':
        this.weaponHandling = 'one-handed';
        this.slotType = 'mainHand';
        break;
      case 'Ranged':
        this.weaponHandling = 'two-handed'; // Bows typically require both hands
        this.slotType = 'mainHand';
        break;
      case 'Staff':
        this.weaponHandling = 'two-handed';
        this.slotType = 'mainHand';
        break;
      case 'Wand':
        this.weaponHandling = 'one-handed';
        this.slotType = 'mainHand';
        break;
      default:
        this.weaponHandling = 'one-handed';
        this.slotType = 'mainHand';
    }
  }
  
  // Auto-assign shield handling
  if (this.category === 'Shield') {
    this.weaponHandling = 'off-hand-only';
    this.slotType = 'offHand';
  }
  
  next();
});

// Validation
ItemSchema.path('requirements').validate(function(requirements) {
  // Validate that stat requirements are reasonable
  for (const req of requirements) {
    if (['STR', 'DEX', 'INT', 'CHA'].includes(req.type) && (req.value < 1 || req.value > 6)) {
      return false;
    }
    if (req.type === 'Level' && (req.value < 1 || req.value > 10)) {
      return false;
    }
  }
  return true;
}, 'Requirements contain invalid values');

ItemSchema.path('bonuses').validate(function(bonuses) {
  // Validate that bonus values are reasonable
  for (const bonus of bonuses) {
    if (['STR', 'DEX', 'INT', 'CHA'].includes(bonus.type) && Math.abs(bonus.value) > 3) {
      return false; // Stat bonuses shouldn't exceed ±3
    }
    if (bonus.type === 'Damage' && bonus.value < 0) {
      return false; // Damage bonuses shouldn't be negative
    }
  }
  return true;
}, 'Bonus values are out of reasonable range');

// Indexes for better performance
ItemSchema.index({ name: 1 });
ItemSchema.index({ category: 1 });
ItemSchema.index({ rarity: 1 });
ItemSchema.index({ baseValue: 1 });
ItemSchema.index({ tags: 1 });
ItemSchema.index({ weaponType: 1 });
ItemSchema.index({ armorType: 1 });
ItemSchema.index({ equipSlot: 1 });
ItemSchema.index({ craftable: 1 });
ItemSchema.index({ createdAt: -1 });
ItemSchema.index({ 'requirements.type': 1, 'requirements.value': 1 });

// Create and export the model
const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;