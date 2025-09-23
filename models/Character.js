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

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bonuses: [BonusSchema],
  abilities: [AbilitySchema], // Changed to use AbilitySchema
  skills: [{ type: String, trim: true }]
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
    type: ClassSchema, 
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
  const classAbilities = this.class.abilities || [];
  const subclassAbilities = this.subclass.abilities || [];
  const originAbilities = this.origin.abilities || [];
  
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
  const classAbilities = this.class.abilities || [];
  const subclassAbilities = this.subclass.abilities || [];
  const originAbilities = this.origin.abilities || [];
  
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

// Pre-save middleware
CharacterSchema.pre('save', function(next) {
  // Ensure maxHp is at least equal to hp
  if (this.hp > this.maxHp) {
    this.maxHp = this.hp;
  }
  next();
});

// Static methods
CharacterSchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

CharacterSchema.statics.findByClass = function(className) {
  return this.find({ 'class.name': new RegExp(className, 'i') });
};

CharacterSchema.statics.findByRace = function(raceName) {
  return this.find({ 'race.name': new RegExp(raceName, 'i') });
};

// Index for faster queries
CharacterSchema.index({ name: 1 });
CharacterSchema.index({ 'class.name': 1 });
CharacterSchema.index({ 'race.name': 1 });
CharacterSchema.index({ createdAt: -1 });

// Create and export the model
const Character = mongoose.model('Character', CharacterSchema);

module.exports = Character;