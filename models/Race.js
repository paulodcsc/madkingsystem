const mongoose = require('mongoose');

/**
 * Race data model for RPG races and subraces using Mongoose
 */

// Schema for individual racial abilities
const RacialAbilitySchema = new mongoose.Schema({
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

// Schema for racial bonuses
const RacialBonusSchema = new mongoose.Schema({
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

// Schema for subraces/variants
const SubraceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    default: '', 
    trim: true 
  },
  abilities: [RacialAbilitySchema],
  bonuses: [RacialBonusSchema],
  skills: [{ 
    type: String, 
    trim: true,
    enum: [
      'heavyWeapons', 'muscle', 'athletics', 'endurance',
      'lightWeapons', 'rangedWeapons', 'stealth', 'acrobatics', 'legerdemain',
      'negotiation', 'deception', 'intimidation', 'seduction',
      'arcana', 'lore', 'investigation', 'nature', 'insight'
    ]
  }]
}, { _id: false });

// Main Race Schema
const RaceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Race name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Race name cannot exceed 50 characters']
  },
  
  description: { 
    type: String, 
    default: '',
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Racial size category
  size: {
    type: String,
    required: true,
    enum: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'],
    default: 'Medium'
  },
  
  // Language proficiencies
  languages: [{
    type: String,
    trim: true
  }],
  
  // Racial abilities
  abilities: [RacialAbilitySchema],
  
  // Racial stat bonuses and other bonuses
  bonuses: [RacialBonusSchema],
  
  // Racial skill proficiencies
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
  
  // Available subraces for this race
  subraces: [SubraceSchema],
  
  // Natural armor class bonus (if any)
  naturalArmor: {
    type: Number,
    default: 0,
    min: [0, 'Natural armor cannot be negative']
  },
  
  // Darkvision range in feet
  darkvision: {
    type: Number,
    default: 0,
    min: [0, 'Darkvision range cannot be negative']
  }
  
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  versionKey: false, // Remove __v field
  toJSON: { virtuals: true }, // Include virtuals in JSON output
  toObject: { virtuals: true }
});

// Virtual fields
RaceSchema.virtual('totalAbilities').get(function() {
  const raceAbilities = this.abilities.length;
  const subraceAbilities = this.subraces.reduce((total, subrace) => 
    total + subrace.abilities.length, 0);
  return raceAbilities + subraceAbilities;
});

RaceSchema.virtual('totalBonuses').get(function() {
  const raceBonuses = this.bonuses.length;
  const subraceBonuses = this.subraces.reduce((total, subrace) => 
    total + subrace.bonuses.length, 0);
  return raceBonuses + subraceBonuses;
});

RaceSchema.virtual('allSkills').get(function() {
  const raceSkills = this.skills || [];
  const subraceSkills = this.subraces.reduce((skills, subrace) => 
    [...skills, ...(subrace.skills || [])], []);
  
  return [...new Set([...raceSkills, ...subraceSkills])];
});

RaceSchema.virtual('hasDarkvision').get(function() {
  return this.darkvision > 0;
});

// Instance methods
RaceSchema.methods.getAbilitiesAtLevel = function(level, subraceName = null) {
  if (level < 1 || level > 10) {
    throw new Error('Level must be between 1 and 10');
  }
  
  // Get racial abilities up to the specified level
  let abilities = this.abilities.filter(ability => ability.level <= level);
  
  // Add subrace abilities if subrace is specified
  if (subraceName) {
    const subrace = this.getSubrace(subraceName);
    if (subrace) {
      const subraceAbilities = subrace.abilities.filter(ability => ability.level <= level);
      abilities = [...abilities, ...subraceAbilities];
    }
  }
  
  return abilities.sort((a, b) => a.level - b.level);
};

RaceSchema.methods.getAllBonuses = function(subraceName = null) {
  let bonuses = [...this.bonuses];
  
  // Add subrace bonuses if subrace is specified
  if (subraceName) {
    const subrace = this.getSubrace(subraceName);
    if (subrace) {
      bonuses = [...bonuses, ...subrace.bonuses];
    }
  }
  
  return bonuses;
};

RaceSchema.methods.getBonusByType = function(type, subraceName = null) {
  const allBonuses = this.getAllBonuses(subraceName);
  return allBonuses.filter(bonus => bonus.type === type);
};

RaceSchema.methods.getTotalBonusForType = function(type, subraceName = null) {
  const bonuses = this.getBonusByType(type, subraceName);
  return bonuses.reduce((total, bonus) => total + bonus.value, 0);
};

RaceSchema.methods.getAllSkills = function(subraceName = null) {
  let skills = [...this.skills];
  
  // Add subrace skills if subrace is specified
  if (subraceName) {
    const subrace = this.getSubrace(subraceName);
    if (subrace) {
      skills = [...skills, ...subrace.skills];
    }
  }
  
  return [...new Set(skills)];
};

RaceSchema.methods.getSubrace = function(subraceName) {
  return this.subraces.find(sub => sub.name === subraceName);
};

RaceSchema.methods.hasSubrace = function(subraceName) {
  return this.subraces.some(sub => sub.name === subraceName);
};

RaceSchema.methods.addSubrace = function(subrace) {
  if (this.hasSubrace(subrace.name)) {
    throw new Error(`Subrace ${subrace.name} already exists`);
  }
  this.subraces.push(subrace);
  return this;
};

RaceSchema.methods.removeSubrace = function(subraceName) {
  const index = this.subraces.findIndex(sub => sub.name === subraceName);
  if (index === -1) {
    throw new Error(`Subrace ${subraceName} not found`);
  }
  this.subraces.splice(index, 1);
  return this;
};

RaceSchema.methods.getStatBonuses = function(subraceName = null) {
  const statBonuses = {
    STR: this.getTotalBonusForType('STR', subraceName),
    DEX: this.getTotalBonusForType('DEX', subraceName),
    INT: this.getTotalBonusForType('INT', subraceName),
    CHA: this.getTotalBonusForType('CHA', subraceName)
  };
  
  // Filter out bonuses that are 0
  return Object.fromEntries(
    Object.entries(statBonuses).filter(([key, value]) => value !== 0)
  );
};

RaceSchema.methods.getCombatBonuses = function(subraceName = null) {
  return {
    HP: this.getTotalBonusForType('HP', subraceName),
    Mana: this.getTotalBonusForType('Mana', subraceName),
    AC: this.getTotalBonusForType('AC', subraceName),
    Speed: this.getTotalBonusForType('Speed', subraceName)
  };
};

RaceSchema.methods.getEffectiveSpeedBonus = function(subraceName = null) {
  return this.getTotalBonusForType('Speed', subraceName);
};

// Static methods
RaceSchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

RaceSchema.statics.getRacesWithSubraces = function() {
  return this.find({}).select('name description subraces.name');
};

RaceSchema.statics.findBySize = function(size) {
  return this.find({ size: size });
};

RaceSchema.statics.findWithDarkvision = function() {
  return this.find({ darkvision: { $gt: 0 } });
};

RaceSchema.statics.findByLanguage = function(language) {
  return this.find({ languages: language });
};

RaceSchema.statics.findBySkill = function(skillName) {
  return this.find({
    $or: [
      { skills: skillName },
      { 'subraces.skills': skillName }
    ]
  });
};

// Pre-save middleware
RaceSchema.pre('save', function(next) {
  // Ensure abilities are sorted by level
  this.abilities.sort((a, b) => a.level - b.level);
  
  // Ensure subrace abilities are sorted by level
  this.subraces.forEach(subrace => {
    subrace.abilities.sort((a, b) => a.level - b.level);
  });
  
  // Remove duplicate skills
  this.skills = [...new Set(this.skills)];
  this.subraces.forEach(subrace => {
    subrace.skills = [...new Set(subrace.skills)];
  });
  
  // Remove duplicate languages
  this.languages = [...new Set(this.languages)];
  
  next();
});

// Validation
RaceSchema.path('bonuses').validate(function(bonuses) {
  // Validate that bonus values are reasonable
  for (const bonus of bonuses) {
    if (bonus.type === 'STR' || bonus.type === 'DEX' || bonus.type === 'INT' || bonus.type === 'CHA') {
      if (Math.abs(bonus.value) > 3) {
        return false; // Stat bonuses shouldn't be more than ±3
      }
    }
    if (bonus.type === 'Speed' && bonus.value < -20) {
      return false; // Speed penalties shouldn't be too severe
    }
  }
  return true;
}, 'Bonus values are out of reasonable range');

// Indexes for better performance
RaceSchema.index({ name: 1 });
RaceSchema.index({ size: 1 });
RaceSchema.index({ 'subraces.name': 1 });
RaceSchema.index({ darkvision: 1 });
RaceSchema.index({ languages: 1 });
RaceSchema.index({ skills: 1 });
RaceSchema.index({ createdAt: -1 });

// Create and export the model
const Race = mongoose.model('Race', RaceSchema);

module.exports = Race;