const mongoose = require('mongoose');

/**
 * Class data model for RPG classes and subclasses using Mongoose
 */

// Schema for individual abilities
const ClassAbilitySchema = new mongoose.Schema({
  level: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 10 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true, 
    trim: true 
  }
}, { _id: false });

// Schema for subclasses
const SubclassSchema = new mongoose.Schema({
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
  abilities: [ClassAbilitySchema] // Even level abilities (2, 4, 6, 8, 10)
}, { _id: false });

// Main Class Schema
const ClassSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Class name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Class name cannot exceed 50 characters']
  },
  
  description: { 
    type: String, 
    default: '',
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // HP bonus per level
  hpBonusPerLevel: { 
    type: Number, 
    required: true,
    min: [0, 'HP bonus per level cannot be negative'],
    default: 10
  },
  
  // Mana bonus per level
  manaBonusPerLevel: { 
    type: Number, 
    required: true,
    min: [0, 'Mana bonus per level cannot be negative'],
    default: 0
  },
  
  // Class abilities (odd levels: 1, 3, 5, 7, 9)
  abilities: [ClassAbilitySchema],
  
  // Available subclasses for this class
  subclasses: [SubclassSchema]
  
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  versionKey: false, // Remove __v field
  toJSON: { virtuals: true }, // Include virtuals in JSON output
  toObject: { virtuals: true }
});

// Virtual fields
ClassSchema.virtual('maxLevel').get(function() {
  return 10;
});

ClassSchema.virtual('totalAbilities').get(function() {
  const classAbilities = this.abilities.length;
  const subclassAbilities = this.subclasses.reduce((total, subclass) => 
    total + subclass.abilities.length, 0);
  return classAbilities + subclassAbilities;
});

// Instance methods
ClassSchema.methods.getHpBonusAtLevel = function(level) {
  if (level < 1 || level > 10) {
    throw new Error('Level must be between 1 and 10');
  }
  return this.hpBonusPerLevel * level;
};

ClassSchema.methods.getManaBonusAtLevel = function(level) {
  if (level < 1 || level > 10) {
    throw new Error('Level must be between 1 and 10');
  }
  return this.manaBonusPerLevel * level;
};

ClassSchema.methods.getAbilitiesAtLevel = function(level) {
  if (level < 1 || level > 10) {
    throw new Error('Level must be between 1 and 10');
  }
  
  // Get class abilities up to the specified level (odd levels only)
  const classAbilities = this.abilities.filter(ability => 
    ability.level <= level && ability.level % 2 === 1
  );
  
  return classAbilities;
};

ClassSchema.methods.getSubclassAbilitiesAtLevel = function(subclassName, level) {
  if (level < 1 || level > 10) {
    throw new Error('Level must be between 1 and 10');
  }
  
  const subclass = this.subclasses.find(sub => sub.name === subclassName);
  if (!subclass) {
    throw new Error(`Subclass ${subclassName} not found`);
  }
  
  // Get subclass abilities up to the specified level (even levels only)
  const subclassAbilities = subclass.abilities.filter(ability => 
    ability.level <= level && ability.level % 2 === 0
  );
  
  return subclassAbilities;
};

ClassSchema.methods.getAllAbilitiesAtLevel = function(subclassName, level) {
  const classAbilities = this.getAbilitiesAtLevel(level);
  const subclassAbilities = subclassName ? 
    this.getSubclassAbilitiesAtLevel(subclassName, level) : [];
  
  return [
    ...classAbilities.map(ability => ({ 
      ...ability.toObject(), 
      source: 'class',
      className: this.name 
    })),
    ...subclassAbilities.map(ability => ({ 
      ...ability.toObject(), 
      source: 'subclass',
      subclassName: subclassName 
    }))
  ].sort((a, b) => a.level - b.level);
};

ClassSchema.methods.getSubclass = function(subclassName) {
  return this.subclasses.find(sub => sub.name === subclassName);
};

ClassSchema.methods.hasSubclass = function(subclassName) {
  return this.subclasses.some(sub => sub.name === subclassName);
};

ClassSchema.methods.addSubclass = function(subclass) {
  if (this.hasSubclass(subclass.name)) {
    throw new Error(`Subclass ${subclass.name} already exists`);
  }
  this.subclasses.push(subclass);
  return this;
};

ClassSchema.methods.removeSubclass = function(subclassName) {
  const index = this.subclasses.findIndex(sub => sub.name === subclassName);
  if (index === -1) {
    throw new Error(`Subclass ${subclassName} not found`);
  }
  this.subclasses.splice(index, 1);
  return this;
};

// Static methods
ClassSchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

ClassSchema.statics.getClassesWithSubclasses = function() {
  return this.find({}).select('name description subclasses.name');
};

// Validation
ClassSchema.path('abilities').validate(function(abilities) {
  // Validate that class abilities are only on odd levels (1, 3, 5, 7, 9)
  for (const ability of abilities) {
    if (ability.level % 2 === 0) {
      return false;
    }
  }
  return true;
}, 'Class abilities must be on odd levels only (1, 3, 5, 7, 9)');

ClassSchema.path('subclasses').validate(function(subclasses) {
  // Validate that subclass abilities are only on even levels (2, 4, 6, 8, 10)
  for (const subclass of subclasses) {
    for (const ability of subclass.abilities) {
      if (ability.level % 2 === 1) {
        return false;
      }
    }
  }
  return true;
}, 'Subclass abilities must be on even levels only (2, 4, 6, 8, 10)');

// Pre-save middleware
ClassSchema.pre('save', function(next) {
  // Ensure abilities are sorted by level
  this.abilities.sort((a, b) => a.level - b.level);
  
  // Ensure subclass abilities are sorted by level
  this.subclasses.forEach(subclass => {
    subclass.abilities.sort((a, b) => a.level - b.level);
  });
  
  next();
});

// Indexes for better performance
ClassSchema.index({ name: 1 });
ClassSchema.index({ 'subclasses.name': 1 });
ClassSchema.index({ createdAt: -1 });

// Create and export the model
const Class = mongoose.model('Class', ClassSchema);

module.exports = Class;