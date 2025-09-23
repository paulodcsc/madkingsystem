const mongoose = require('mongoose');

/**
 * Character data model for RPG character sheet using Mongoose
 */

// Sub-schemas for nested objects
const AbilitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  source: { type: String, default: '', trim: true }, // e.g., 'class', 'subclass', 'origin', 'racial'
  level: { type: Number, required: true },
}, { _id: false });

const RaceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  ability: [AbilitySchema] // Changed from single string to array of abilities
}, { _id: false });

const BonusSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  value: { type: Number, required: true },
  description: { type: String, default: '', trim: true }
}, { _id: false });

// Reference to the Class model instead of embedding
const ClassRefSchema = new mongoose.Schema({
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true 
  },
  name: { type: String, required: true, trim: true }, // Denormalized for quick access
  bonuses: [BonusSchema], // Character-specific bonuses from this class
  skills: [{ type: String, trim: true }] // Character-specific skills from this class
}, { _id: false });

// Schema for character spells
const CharacterSpellSchema = new mongoose.Schema({
  spellId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spell',
    required: true
  },
  name: { type: String, required: true, trim: true }, // Denormalized for quick access
  circle: { type: Number, required: true, min: 1, max: 5 }, // Spell level (1st-5th circle)
  manaCost: { type: Number, required: true, min: 0 }, // Denormalized for quick access
  isKnown: { type: Boolean, default: true }, // Whether the character knows this spell
  isPrepared: { type: Boolean, default: false }, // Whether the spell is prepared for use
  source: { 
    type: String, 
    enum: ['class', 'subclass', 'item', 'learned', 'racial'],
    default: 'learned'
  }, // How the character acquired this spell
  notes: { type: String, default: '', trim: true } // Character-specific notes about the spell
}, { _id: false });

const SubclassSchema = new mongoose.Schema({
  name: { type: String, default: '', trim: true },
  bonuses: [BonusSchema],
  abilities: [AbilitySchema] // Changed to use AbilitySchema
}, { _id: false });

const OriginSchema = new mongoose.Schema({
  name: { type: String, default: '', trim: true },
  bonuses: [BonusSchema],
  abilities: [AbilitySchema], // Changed to use AbilitySchema
  skills: [{ type: String, trim: true }]
}, { _id: false });

const StatsSchema = new mongoose.Schema({
  str: { type: Number, required: true, min: 1, max: 6, default: 1 },
  dex: { type: Number, required: true, min: 1, max: 6, default: 1 },
  int: { type: Number, required: true, min: 1, max: 6, default: 1 },
  cha: { type: Number, required: true, min: 1, max: 6, default: 1 },
}, { _id: false });

const ArmorSchema = new mongoose.Schema({
  name: { type: String, default: '', trim: true },
  acBonus: { type: Number, default: 0, min: 0 }
}, { _id: false });

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  quantity: { type: Number, default: 1, min: 1 },
  value: { type: Number, default: 0, min: 0 }
}, { _id: false });

// Skills Schema - organized by ability scores
const SkillSchema = new mongoose.Schema({
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

// Main Character Schema
const CharacterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Character name is required'],
    trim: true,
    maxlength: [100, 'Character name cannot exceed 100 characters']
  },
  
  // Basic character info
  race: { 
    type: RaceSchema, 
    required: true 
  },
  
  class: { 
    type: ClassRefSchema, 
    required: true 
  },
  
  subclass: { 
    type: SubclassSchema, 
    default: () => ({}) 
  },
  
  origin: { 
    type: OriginSchema, 
    default: () => ({}) 
  },
  
  // Extra skills beyond class/origin
  extraSkills: [{ type: String, trim: true }],
  
  // Character skills with proficiency tracking
  skills: { 
    type: SkillSchema, 
    default: () => ({}) 
  },
  
  // Character stats
  stats: { 
    type: StatsSchema, 
    required: true,
    default: () => ({})
  },
  
  // Character level
  level: {
    type: Number,
    required: true,
    min: [1, 'Level must be at least 1'],
    max: [10, 'Level cannot exceed 10'],
    default: 1
  },
  
  // Combat stats
  hp: { 
    type: Number, 
    required: true, 
    min: [1, 'HP must be at least 1'], 
    default: 10 
  },
  maxHp: { 
    type: Number, 
    required: true, 
    min: [1, 'Max HP must be at least 1'], 
    default: 10 
  },
  ac: { 
    type: Number, 
    required: true, 
    min: [1, 'AC must be at least 1'], 
    default: 10 
  },
  mana: { 
    type: Number, 
    default: null,
    min: 0
  },
  maxMana: {
    type: Number,
    default: null,
    min: 0
  },
  
  // Movement speed
  baseSpeed: {
    type: Number,
    default: 30,
    min: [0, 'Base speed cannot be negative']
  },
  speedModifiers: [{
    type: { type: String, required: true, trim: true }, // e.g., 'armor', 'spell', 'racial', 'item'
    value: { type: Number, required: true }, // positive or negative modifier
    source: { type: String, default: '', trim: true }, // description of the source
    description: { type: String, default: '', trim: true }
  }],
  
  // Spell system
  spells: [CharacterSpellSchema],
  spellcastingAbility: {
    type: String,
    enum: ['str', 'dex', 'int', 'cha', ''],
    default: ''
  },
  
  // Equipment
  armor: { 
    type: ArmorSchema, 
    default: () => ({}) 
  },
  
  items: [ItemSchema],
  
  // Currency (MKS - Mad King Shillings)
  currency: { 
    type: Number, 
    default: 0,
    min: [0, 'Currency cannot be negative']
  },
  
  // Character backstory
  backstory: { 
    type: String, 
    default: '',
    maxlength: [5000, 'Backstory cannot exceed 5000 characters']
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  versionKey: false, // Remove __v field
  toJSON: { virtuals: true }, // Include virtuals in JSON output
  toObject: { virtuals: true }
});
// Virtual fields for computed properties
CharacterSchema.virtual('statModifiers').get(function() {
  return {
    str: Math.floor((this.stats.str - 10) / 2),
    dex: Math.floor((this.stats.dex - 10) / 2),
    int: Math.floor((this.stats.int - 10) / 2)
  };
});

CharacterSchema.virtual('allSkills').get(function() {
  const classSkills = this.class.skills || [];
  const originSkills = this.origin.skills || [];
  const extraSkills = this.extraSkills || [];
  
  return [...new Set([...classSkills, ...originSkills, ...extraSkills])];
});

CharacterSchema.virtual('allAbilities').get(function() {
  const raceAbilities = this.race.ability || [];
  const subclassAbilities = this.subclass.abilities || [];
  const originAbilities = this.origin.abilities || [];
  
  // Note: Class abilities now come from the populated Class model
  // You'll need to populate the class field to access abilities
  const classAbilities = this.populated('class.classId') && this.class.classId.abilities 
    ? this.class.classId.abilities 
    : [];
  
  return [
    ...raceAbilities.map(ability => ({ ...ability.toObject(), source: 'race' })),
    ...classAbilities.map(ability => ({ ...ability.toObject(), source: 'class' })),
    ...subclassAbilities.map(ability => ({ ...ability.toObject(), source: 'subclass' })),
    ...originAbilities.map(ability => ({ ...ability.toObject(), source: 'origin' }))
  ];
});

CharacterSchema.virtual('totalAC').get(function() {
  const armorBonus = this.armor.acBonus || 0;
  const classACBonus = this.class.bonuses?.find(b => b.type === 'AC')?.value || 0;
  return this.ac + armorBonus + classACBonus;
});

CharacterSchema.virtual('totalSpeed').get(function() {
  const speedModifierSum = this.speedModifiers.reduce((sum, modifier) => sum + modifier.value, 0);
  return Math.max(0, this.baseSpeed + speedModifierSum); // Speed cannot be negative
});

// Skills-related virtual fields
CharacterSchema.virtual('proficientSkills').get(function() {
  const proficient = [];
  const skillMap = {
    // Strength-based skills
    heavyWeapons: 'str',
    muscle: 'str',
    athletics: 'str',
    endurance: 'str',
    // Dexterity-based skills
    lightWeapons: 'dex',
    rangedWeapons: 'dex',
    stealth: 'dex',
    acrobatics: 'dex',
    legerdemain: 'dex',
    // Charisma-based skills
    negotiation: 'cha',
    deception: 'cha',
    intimidation: 'cha',
    seduction: 'cha',
    // Intelligence-based skills
    arcana: 'int',
    lore: 'int',
    investigation: 'int',
    nature: 'int'
  };
  
  for (const [skill, ability] of Object.entries(skillMap)) {
    if (this.skills[skill]) {
      proficient.push({ skill, ability });
    }
  }
  
  return proficient;
});

CharacterSchema.virtual('skillsByStats').get(function() {
  return {
    str: {
      heavyWeapons: this.skills.heavyWeapons,
      muscle: this.skills.muscle,
      athletics: this.skills.athletics,
      endurance: this.skills.endurance
    },
    dex: {
      lightWeapons: this.skills.lightWeapons,
      rangedWeapons: this.skills.rangedWeapons,
      stealth: this.skills.stealth,
      acrobatics: this.skills.acrobatics,
      legerdemain: this.skills.legerdemain
    },
    cha: {
      negotiation: this.skills.negotiation,
      deception: this.skills.deception,
      intimidation: this.skills.intimidation,
      seduction: this.skills.seduction
    },
    int: {
      arcana: this.skills.arcana,
      lore: this.skills.lore,
      investigation: this.skills.investigation,
      nature: this.skills.nature
    }
  };
});

// Spell-related virtual fields
CharacterSchema.virtual('knownSpells').get(function() {
  return this.spells.filter(spell => spell.isKnown);
});

CharacterSchema.virtual('preparedSpells').get(function() {
  return this.spells.filter(spell => spell.isPrepared);
});

CharacterSchema.virtual('spellsByCircle').get(function() {
  const spellsByCircle = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  };
  
  this.spells.forEach(spell => {
    if (spellsByCircle[spell.circle]) {
      spellsByCircle[spell.circle].push(spell);
    }
  });
  
  return spellsByCircle;
});

CharacterSchema.virtual('spellcastingModifier').get(function() {
  if (!this.spellcastingAbility || !this.stats[this.spellcastingAbility]) {
    return 0;
  }
  return this.getStatModifier(this.stats[this.spellcastingAbility]);
});

// Instance methods
CharacterSchema.methods.getStatModifier = function(statValue) {
  return Math.floor((statValue - 10) / 2);
};

CharacterSchema.methods.getStatModifiers = function() {
  return {
    str: this.getStatModifier(this.stats.str),
    dex: this.getStatModifier(this.stats.dex),
    int: this.getStatModifier(this.stats.int)
  };
};

CharacterSchema.methods.getAllSkills = function() {
  const classSkills = this.class.skills || [];
  const originSkills = this.origin.skills || [];
  const extraSkills = this.extraSkills || [];
  
  return [...new Set([...classSkills, ...originSkills, ...extraSkills])];
};

CharacterSchema.methods.getAllAbilities = function() {
  const raceAbilities = this.race.ability || [];
  const subclassAbilities = this.subclass.abilities || [];
  const originAbilities = this.origin.abilities || [];
  
  // Note: Class abilities now come from the populated Class model
  const classAbilities = this.populated('class.classId') && this.class.classId.abilities 
    ? this.class.classId.abilities 
    : [];
  
  return [
    ...raceAbilities.map(ability => ({ ...ability.toObject(), source: 'race' })),
    ...classAbilities.map(ability => ({ ...ability.toObject(), source: 'class' })),
    ...subclassAbilities.map(ability => ({ ...ability.toObject(), source: 'subclass' })),
    ...originAbilities.map(ability => ({ ...ability.toObject(), source: 'origin' }))
  ];
};

CharacterSchema.methods.getTotalAC = function() {
  const armorBonus = this.armor.acBonus || 0;
  const classACBonus = this.class.bonuses?.find(b => b.type === 'AC')?.value || 0;
  return this.ac + armorBonus + classACBonus;
};

// Skills-related instance methods
CharacterSchema.methods.hasSkillProficiency = function(skillName) {
  return this.skills[skillName] === true;
};

CharacterSchema.methods.setSkillProficiency = function(skillName, proficient = true) {
  const validSkills = [
    'heavyWeapons', 'muscle', 'athletics', 'endurance',
    'lightWeapons', 'rangedWeapons', 'stealth', 'acrobatics', 'legerdemain',
    'negotiation', 'deception', 'intimidation', 'seduction',
    'arcana', 'lore', 'investigation', 'nature'
  ];
  
  if (!validSkills.includes(skillName)) {
    throw new Error(`Invalid skill name: ${skillName}`);
  }
  
  this.skills[skillName] = proficient;
  return this;
};

CharacterSchema.methods.getSkillModifier = function(skillName) {
  const skillAbilityMap = {
    heavyWeapons: 'str', muscle: 'str', athletics: 'str', endurance: 'str',
    lightWeapons: 'dex', rangedWeapons: 'dex', stealth: 'dex', acrobatics: 'dex', legerdemain: 'dex',
    negotiation: 'cha', deception: 'cha', intimidation: 'cha', seduction: 'cha',
    arcana: 'int', lore: 'int', investigation: 'int', nature: 'int'
  };
  
  const abilityScore = skillAbilityMap[skillName];
  if (!abilityScore) {
    throw new Error(`Invalid skill name: ${skillName}`);
  }
  
  const baseModifier = this.getStatModifier(this.stats[abilityScore]);
  const proficiencyBonus = this.hasSkillProficiency(skillName) ? 2 : 0; // Standard proficiency bonus
  
  return baseModifier + proficiencyBonus;
};

CharacterSchema.methods.rollSkillCheck = function(skillName) {
  const modifier = this.getSkillModifier(skillName);
  const roll = Math.floor(Math.random() * 20) + 1;
  
  return {
    roll,
    modifier,
    total: roll + modifier,
    isProficient: this.hasSkillProficiency(skillName)
  };
};

CharacterSchema.methods.getProficientSkills = function() {
  const proficient = [];
  const skillNames = [
    'heavyWeapons', 'muscle', 'athletics', 'endurance',
    'lightWeapons', 'rangedWeapons', 'stealth', 'acrobatics', 'legerdemain',
    'negotiation', 'deception', 'intimidation', 'seduction',
    'arcana', 'lore', 'investigation', 'nature'
  ];
  
  skillNames.forEach(skill => {
    if (this.hasSkillProficiency(skill)) {
      proficient.push(skill);
    }
  });
  
  return proficient;
};

CharacterSchema.methods.getSkillsByAbility = function(abilityScore) {
  const abilitySkills = {
    str: ['heavyWeapons', 'muscle', 'athletics', 'endurance'],
    dex: ['lightWeapons', 'rangedWeapons', 'stealth', 'acrobatics', 'legerdemain'],
    cha: ['negotiation', 'deception', 'intimidation', 'seduction'],
    int: ['arcana', 'lore', 'investigation', 'nature']
  };
  
  const skillList = abilitySkills[abilityScore];
  if (!skillList) {
    throw new Error(`Invalid ability score: ${abilityScore}`);
  }
  
  return skillList.map(skill => ({
    name: skill,
    proficient: this.hasSkillProficiency(skill),
    modifier: this.getSkillModifier(skill)
  }));
};

// Spell-related instance methods
CharacterSchema.methods.addSpell = function(spellData) {
  // Check if spell already exists
  const existingSpell = this.spells.find(spell => 
    spell.spellId.toString() === spellData.spellId.toString()
  );
  
  if (existingSpell) {
    throw new Error('Spell already known');
  }
  
  this.spells.push(spellData);
  return this;
};

CharacterSchema.methods.removeSpell = function(spellId) {
  const index = this.spells.findIndex(spell => 
    spell.spellId.toString() === spellId.toString()
  );
  
  if (index === -1) {
    throw new Error('Spell not found');
  }
  
  this.spells.splice(index, 1);
  return this;
};

CharacterSchema.methods.prepareSpell = function(spellId) {
  const spell = this.spells.find(spell => 
    spell.spellId.toString() === spellId.toString()
  );
  
  if (!spell) {
    throw new Error('Spell not known');
  }
  
  if (!spell.isKnown) {
    throw new Error('Cannot prepare unknown spell');
  }
  
  spell.isPrepared = true;
  return this;
};

CharacterSchema.methods.unprepareSpell = function(spellId) {
  const spell = this.spells.find(spell => 
    spell.spellId.toString() === spellId.toString()
  );
  
  if (!spell) {
    throw new Error('Spell not found');
  }
  
  spell.isPrepared = false;
  return this;
};

CharacterSchema.methods.canCastSpell = function(spellId) {
  const spell = this.spells.find(spell => 
    spell.spellId.toString() === spellId.toString()
  );
  
  if (!spell || !spell.isKnown || !spell.isPrepared) {
    return { canCast: false, reason: 'Spell not prepared' };
  }
  
  if (this.mana === null || this.mana < spell.manaCost) {
    return { canCast: false, reason: 'Insufficient mana' };
  }
  
  return { canCast: true };
};

CharacterSchema.methods.castSpell = function(spellId) {
  const castCheck = this.canCastSpell(spellId);
  if (!castCheck.canCast) {
    throw new Error(castCheck.reason);
  }
  
  const spell = this.spells.find(spell => 
    spell.spellId.toString() === spellId.toString()
  );
  
  this.mana -= spell.manaCost;
  return {
    spell: spell,
    remainingMana: this.mana
  };
};

CharacterSchema.methods.getSpellsByCircle = function(circle) {
  return this.spells.filter(spell => spell.circle === circle);
};

CharacterSchema.methods.getKnownSpells = function() {
  return this.spells.filter(spell => spell.isKnown);
};

CharacterSchema.methods.getPreparedSpells = function() {
  return this.spells.filter(spell => spell.isPrepared);
};

CharacterSchema.methods.getSpellcastingModifier = function() {
  if (!this.spellcastingAbility || !this.stats[this.spellcastingAbility]) {
    return 0;
  }
  return this.getStatModifier(this.stats[this.spellcastingAbility]);
};

CharacterSchema.methods.getSpellAttackBonus = function() {
  const proficiencyBonus = 2; // Standard proficiency bonus (could be level-based)
  return this.getSpellcastingModifier() + proficiencyBonus;
};

CharacterSchema.methods.getSpellSaveDC = function() {
  const baseDC = 8;
  const proficiencyBonus = 2; // Standard proficiency bonus (could be level-based)
  return baseDC + proficiencyBonus + this.getSpellcastingModifier();
};

// Speed-related instance methods
CharacterSchema.methods.getTotalSpeed = function() {
  const speedModifierSum = this.speedModifiers.reduce((sum, modifier) => sum + modifier.value, 0);
  return Math.max(0, this.baseSpeed + speedModifierSum); // Speed cannot be negative
};

CharacterSchema.methods.addSpeedModifier = function(modifierData) {
  // Check if a modifier with the same type and source already exists
  const existingModifier = this.speedModifiers.find(modifier => 
    modifier.type === modifierData.type && modifier.source === modifierData.source
  );
  
  if (existingModifier) {
    // Update the existing modifier
    existingModifier.value = modifierData.value;
    existingModifier.description = modifierData.description || existingModifier.description;
  } else {
    // Add new modifier
    this.speedModifiers.push(modifierData);
  }
  
  return this;
};

CharacterSchema.methods.removeSpeedModifier = function(type, source) {
  const index = this.speedModifiers.findIndex(modifier => 
    modifier.type === type && modifier.source === source
  );
  
  if (index === -1) {
    throw new Error(`Speed modifier of type '${type}' from source '${source}' not found`);
  }
  
  this.speedModifiers.splice(index, 1);
  return this;
};

CharacterSchema.methods.getSpeedModifiersByType = function(type) {
  return this.speedModifiers.filter(modifier => modifier.type === type);
};

CharacterSchema.methods.hasSpeedModifier = function(type, source) {
  return this.speedModifiers.some(modifier => 
    modifier.type === type && modifier.source === source
  );
};

CharacterSchema.methods.getSpeedBreakdown = function() {
  return {
    baseSpeed: this.baseSpeed,
    modifiers: this.speedModifiers.map(modifier => ({
      type: modifier.type,
      value: modifier.value,
      source: modifier.source,
      description: modifier.description
    })),
    totalSpeed: this.getTotalSpeed()
  };
};

// Pre-save middleware
CharacterSchema.pre('save', function(next) {
  // Ensure maxHp is at least equal to hp
  if (this.hp > this.maxHp) {
    this.maxHp = this.hp;
  }
  
  // Ensure maxMana is at least equal to mana if both are set
  if (this.mana !== null && this.maxMana !== null && this.mana > this.maxMana) {
    this.maxMana = this.mana;
  }
  
  // Sort spells by circle and name for consistency
  this.spells.sort((a, b) => {
    if (a.circle !== b.circle) {
      return a.circle - b.circle;
    }
    return a.name.localeCompare(b.name);
  });
  
  next();
});

// Static methods
CharacterSchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

CharacterSchema.statics.findWithClassData = function(query = {}) {
  return this.find(query).populate('class.classId');
};

CharacterSchema.statics.findByClass = function(className) {
  return this.find({ 'class.name': new RegExp(className, 'i') });
};

CharacterSchema.statics.findByClassId = function(classId) {
  return this.find({ 'class.classId': classId });
};

CharacterSchema.statics.findBySpell = function(spellId) {
  return this.find({ 'spells.spellId': spellId });
};

CharacterSchema.statics.findSpellcasters = function() {
  return this.find({ 
    $and: [
      { spellcastingAbility: { $ne: '' } },
      { 'spells.0': { $exists: true } }
    ]
  });
};

CharacterSchema.statics.findBySpellCircle = function(circle) {
  return this.find({ 'spells.circle': circle });
};

CharacterSchema.statics.findByRace = function(raceName) {
  return this.find({ 'race.name': new RegExp(raceName, 'i') });
};

// Index for faster queries
CharacterSchema.index({ name: 1 });
CharacterSchema.index({ 'class.name': 1 });
CharacterSchema.index({ 'race.name': 1 });
CharacterSchema.index({ createdAt: -1 });
CharacterSchema.index({ 'spells.spellId': 1 });
CharacterSchema.index({ 'spells.circle': 1 });
CharacterSchema.index({ spellcastingAbility: 1 });
CharacterSchema.index({ level: 1 });
CharacterSchema.index({ baseSpeed: 1 });

// Create and export the model
const Character = mongoose.model('Character', CharacterSchema);

module.exports = Character;