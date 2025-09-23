const mongoose = require('mongoose');

/**
 * Origin data model for RPG character backgrounds and origins using Mongoose
 */

// Schema for origin abilities
const OriginAbilitySchema = new mongoose.Schema({
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
  level: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10,
    default: 1
  }
}, { _id: false });

// Schema for origin bonuses
const OriginBonusSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['STR', 'DEX', 'INT', 'CHA', 'HP', 'Mana', 'AC', 'Speed'],
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
  }
}, { _id: false });

// Schema for starting equipment
const StartingEquipmentSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  description: {
    type: String,
    default: '',
    trim: true
  }
}, { _id: false });

// Schema for origin connections (contacts, allies, enemies)
const ConnectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  relationship: {
    type: String,
    required: true,
    enum: ['Ally', 'Contact', 'Rival', 'Enemy', 'Family', 'Mentor', 'Student', 'Guild Member'],
    default: 'Contact'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    default: '',
    trim: true
  }
}, { _id: false });

// Main Origin Schema
const OriginSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Origin name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Origin name cannot exceed 50 characters']
  },
  
  description: { 
    type: String, 
    required: [true, 'Origin description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Origin category
  category: {
    type: String,
    required: true,
    enum: [
      'Noble', 'Commoner', 'Criminal', 'Scholar', 'Military', 'Religious', 
      'Artisan', 'Merchant', 'Entertainer', 'Hermit', 'Folk Hero', 'Outlander'
    ],
    default: 'Commoner'
  },
  
  // Social standing and wealth
  socialStanding: {
    type: String,
    required: true,
    enum: ['Outcast', 'Lower Class', 'Middle Class', 'Upper Class', 'Nobility', 'Royalty'],
    default: 'Middle Class'
  },
  
  // Starting wealth (in Mad King Shillings)
  startingWealth: {
    min: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    },
    max: {
      type: Number,
      required: true,
      min: 0,
      default: 50
    }
  },
  
  // Origin abilities (special traits and features)
  abilities: [OriginAbilitySchema],
  
  // Stat bonuses and other bonuses from origin
  bonuses: [OriginBonusSchema],
  
  // Skill proficiencies granted by this origin
  skills: [{ 
    type: String, 
    trim: true,
    enum: [
      'heavyWeapons', 'muscle', 'athletics', 'endurance',
      'lightWeapons', 'rangedWeapons', 'stealth', 'acrobatics', 'legerdemain',
      'negotiation', 'deception', 'intimidation', 'seduction',
      'arcana', 'lore', 'investigation', 'nature', 'insight'
    ]
  }],
  
  // Languages known from this origin
  languages: [{
    type: String,
    trim: true
  }],
  
  // Tool proficiencies
  toolProficiencies: [{
    type: String,
    trim: true
    // Examples: "Smith's Tools", "Thieves' Tools", "Musical Instrument", etc.
  }],
  
  // Starting equipment
  startingEquipment: [StartingEquipmentSchema],
  
  // Social connections
  connections: [ConnectionSchema],
  
  // Personality traits common to this origin
  personalityTraits: [{
    type: String,
    trim: true,
    maxlength: [200, 'Personality trait cannot exceed 200 characters']
  }],
  
  // Ideals associated with this origin
  ideals: [{
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
    alignment: {
      type: String,
      enum: ['Good', 'Neutral', 'Evil', 'Lawful', 'Chaotic', 'Any'],
      default: 'Any'
    }
  }],
  
  // Bonds that tie characters to this origin
  bonds: [{
    type: String,
    trim: true,
    maxlength: [200, 'Bond cannot exceed 200 characters']
  }],
  
  // Flaws common to characters from this origin
  flaws: [{
    type: String,
    trim: true,
    maxlength: [200, 'Flaw cannot exceed 200 characters']
  }],
  
  // Origin-specific features and privileges
  features: [{
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
    mechanicalBenefit: {
      type: String,
      default: '',
      trim: true // Game mechanical benefit, if any
    }
  }],
  
  // Typical locations where characters with this origin might be found
  typicalLocations: [{
    type: String,
    trim: true
  }],
  
  // Suggested motivations for adventure
  motivations: [{
    type: String,
    trim: true,
    maxlength: [150, 'Motivation cannot exceed 150 characters']
  }],
  
  // Rarity of this origin (how common it is)
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Very Rare'],
    default: 'Common'
  }
  
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  versionKey: false, // Remove __v field
  toJSON: { virtuals: true }, // Include virtuals in JSON output
  toObject: { virtuals: true }
});

// Virtual fields
OriginSchema.virtual('totalBonuses').get(function() {
  return this.bonuses.length;
});

OriginSchema.virtual('totalAbilities').get(function() {
  return this.abilities.length;
});

OriginSchema.virtual('totalSkills').get(function() {
  return this.skills.length;
});

OriginSchema.virtual('totalConnections').get(function() {
  return this.connections.length;
});

OriginSchema.virtual('averageStartingWealth').get(function() {
  return Math.floor((this.startingWealth.min + this.startingWealth.max) / 2);
});

OriginSchema.virtual('wealthRange').get(function() {
  return this.startingWealth.max - this.startingWealth.min;
});

OriginSchema.virtual('isNoble').get(function() {
  return this.category === 'Noble' || this.socialStanding === 'Nobility' || this.socialStanding === 'Royalty';
});

OriginSchema.virtual('isOutcast').get(function() {
  return this.socialStanding === 'Outcast' || this.category === 'Criminal';
});

OriginSchema.virtual('hasSpecialPrivileges').get(function() {
  return this.features.length > 0 || this.isNoble;
});

// Instance methods
OriginSchema.methods.getAbilitiesAtLevel = function(level) {
  if (level < 1 || level > 10) {
    throw new Error('Level must be between 1 and 10');
  }
  
  return this.abilities.filter(ability => ability.level <= level);
};

OriginSchema.methods.getBonusByType = function(bonusType) {
  return this.bonuses.filter(bonus => bonus.type === bonusType);
};

OriginSchema.methods.getTotalBonusValue = function(bonusType) {
  const bonuses = this.getBonusByType(bonusType);
  return bonuses.reduce((total, bonus) => total + bonus.value, 0);
};

OriginSchema.methods.getStatBonuses = function() {
  const statBonuses = {
    STR: this.getTotalBonusValue('STR'),
    DEX: this.getTotalBonusValue('DEX'),
    INT: this.getTotalBonusValue('INT'),
    CHA: this.getTotalBonusValue('CHA')
  };
  
  // Filter out bonuses that are 0
  return Object.fromEntries(
    Object.entries(statBonuses).filter(([key, value]) => value !== 0)
  );
};

OriginSchema.methods.getCombatBonuses = function() {
  return {
    HP: this.getTotalBonusValue('HP'),
    Mana: this.getTotalBonusValue('Mana'),
    AC: this.getTotalBonusValue('AC'),
    Speed: this.getTotalBonusValue('Speed')
  };
};

OriginSchema.methods.getConnectionsByType = function(relationshipType) {
  return this.connections.filter(conn => conn.relationship === relationshipType);
};

OriginSchema.methods.getAllies = function() {
  return this.getConnectionsByType('Ally');
};

OriginSchema.methods.getEnemies = function() {
  return this.getConnectionsByType('Enemy');
};

OriginSchema.methods.getContacts = function() {
  return this.getConnectionsByType('Contact');
};

OriginSchema.methods.rollStartingWealth = function() {
  const min = this.startingWealth.min;
  const max = this.startingWealth.max;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

OriginSchema.methods.getRandomPersonalityTrait = function() {
  if (this.personalityTraits.length === 0) return null;
  const index = Math.floor(Math.random() * this.personalityTraits.length);
  return this.personalityTraits[index];
};

OriginSchema.methods.getRandomIdeal = function() {
  if (this.ideals.length === 0) return null;
  const index = Math.floor(Math.random() * this.ideals.length);
  return this.ideals[index];
};

OriginSchema.methods.getRandomBond = function() {
  if (this.bonds.length === 0) return null;
  const index = Math.floor(Math.random() * this.bonds.length);
  return this.bonds[index];
};

OriginSchema.methods.getRandomFlaw = function() {
  if (this.flaws.length === 0) return null;
  const index = Math.floor(Math.random() * this.flaws.length);
  return this.flaws[index];
};

OriginSchema.methods.getRandomMotivation = function() {
  if (this.motivations.length === 0) return null;
  const index = Math.floor(Math.random() * this.motivations.length);
  return this.motivations[index];
};

OriginSchema.methods.generateCharacterBackground = function() {
  return {
    origin: this.name,
    personalityTrait: this.getRandomPersonalityTrait(),
    ideal: this.getRandomIdeal(),
    bond: this.getRandomBond(),
    flaw: this.getRandomFlaw(),
    motivation: this.getRandomMotivation(),
    startingWealth: this.rollStartingWealth(),
    connections: this.connections.slice(0, 2) // First 2 connections
  };
};

OriginSchema.methods.hasSkill = function(skillName) {
  return this.skills.includes(skillName);
};

OriginSchema.methods.hasLanguage = function(language) {
  return this.languages.includes(language);
};

OriginSchema.methods.hasToolProficiency = function(tool) {
  return this.toolProficiencies.includes(tool);
};

// Static methods
OriginSchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

OriginSchema.statics.findByCategory = function(category) {
  return this.find({ category: category });
};

OriginSchema.statics.findBySocialStanding = function(socialStanding) {
  return this.find({ socialStanding: socialStanding });
};

OriginSchema.statics.findByRarity = function(rarity) {
  return this.find({ rarity: rarity });
};

OriginSchema.statics.findBySkill = function(skillName) {
  return this.find({ skills: skillName });
};

OriginSchema.statics.findByLanguage = function(language) {
  return this.find({ languages: language });
};

OriginSchema.statics.findNobleOrigins = function() {
  return this.find({
    $or: [
      { category: 'Noble' },
      { socialStanding: 'Nobility' },
      { socialStanding: 'Royalty' }
    ]
  });
};

OriginSchema.statics.findCommonOrigins = function() {
  return this.find({ rarity: 'Common' });
};

OriginSchema.statics.findByWealthRange = function(minWealth, maxWealth) {
  return this.find({
    'startingWealth.min': { $gte: minWealth },
    'startingWealth.max': { $lte: maxWealth }
  });
};

OriginSchema.statics.findWithConnections = function() {
  return this.find({ 'connections.0': { $exists: true } });
};

OriginSchema.statics.getOriginsSummary = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgWealth: { $avg: { $avg: ['$startingWealth.min', '$startingWealth.max'] } },
        origins: { $push: '$name' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Pre-save middleware
OriginSchema.pre('save', function(next) {
  // Ensure min wealth is not greater than max wealth
  if (this.startingWealth.min > this.startingWealth.max) {
    this.startingWealth.max = this.startingWealth.min;
  }
  
  // Sort arrays for consistency
  this.skills.sort();
  this.languages.sort();
  this.toolProficiencies.sort();
  this.personalityTraits.sort();
  this.bonds.sort();
  this.flaws.sort();
  this.motivations.sort();
  
  // Remove duplicates
  this.skills = [...new Set(this.skills)];
  this.languages = [...new Set(this.languages)];
  this.toolProficiencies = [...new Set(this.toolProficiencies)];
  
  // Sort abilities by level
  this.abilities.sort((a, b) => a.level - b.level);
  
  next();
});

// Validation
OriginSchema.path('bonuses').validate(function(bonuses) {
  // Validate that bonus values are reasonable
  for (const bonus of bonuses) {
    if (['STR', 'DEX', 'INT', 'CHA'].includes(bonus.type) && Math.abs(bonus.value) > 2) {
      return false; // Origin stat bonuses shouldn't exceed ±2
    }
    if (bonus.type === 'Speed' && bonus.value < -10) {
      return false; // Speed penalties shouldn't be too severe
    }
  }
  return true;
}, 'Bonus values are out of reasonable range');

// Note: Starting wealth validation is handled at the schema level with min/max constraints

// Indexes for better performance
OriginSchema.index({ name: 1 });
OriginSchema.index({ category: 1 });
OriginSchema.index({ socialStanding: 1 });
OriginSchema.index({ rarity: 1 });
OriginSchema.index({ skills: 1 });
OriginSchema.index({ languages: 1 });
OriginSchema.index({ 'startingWealth.min': 1, 'startingWealth.max': 1 });
OriginSchema.index({ createdAt: -1 });

// Create and export the model
const Origin = mongoose.model('Origin', OriginSchema);

module.exports = Origin;