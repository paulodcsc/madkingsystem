const mongoose = require('mongoose');

/**
 * Spell data model for RPG magic spells using Mongoose
 */

// Schema for spell components (optional)
const SpellComponentSchema = new mongoose.Schema({
  verbal: { type: Boolean, default: false },
  gesture: { type: Boolean, default: false },
  focus: { type: Boolean, default: false },
  cost: { 
    type: String, 
    default: '', 
    trim: true 
  }
}, { _id: false });

// Main Spell Schema
const SpellSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Spell name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Spell name cannot exceed 100 characters']
  },
  
  description: { 
    type: String, 
    required: [true, 'Spell description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Circle level (1-5)
  circle: { 
    type: Number, 
    required: [true, 'Spell circle is required'],
    min: [1, 'Spell circle must be at least 1'],
    max: [5, 'Spell circle cannot exceed 5']
  },
  
  // Mana cost
  manaCost: { 
    type: Number, 
    required: [true, 'Mana cost is required'],
    min: [0, 'Mana cost cannot be negative']
  },
  
  // School of magic
  school: { 
    type: String, 
    required: [true, 'Spell school is required'],
    enum: [
      'Sacred Veil',
      'Dragon Church', 
      'Slumbering',
      'Deathweaving',
      'Astromancy',
      'Rootbound',
    ],
    trim: true
  },
  
  // Casting time
  castingTime: { 
    type: String, 
    required: [true, 'Casting time is required'],
    trim: true,
    maxlength: [50, 'Casting time cannot exceed 50 characters']
  },
  
  // Range
  range: { 
    type: String, 
    required: [true, 'Spell range is required'],
    trim: true,
    maxlength: [50, 'Range cannot exceed 50 characters']
  },
  
  // Duration
  duration: { 
    type: String, 
    required: [true, 'Spell duration is required'],
    trim: true,
    maxlength: [100, 'Duration cannot exceed 100 characters']
  },
  
  // Components required to cast the spell
  components: { 
    type: SpellComponentSchema, 
    default: () => ({}) 
  },
  
  // Area of effect (optional)
  area: { 
    type: String, 
    default: '',
    trim: true,
    maxlength: [100, 'Area cannot exceed 100 characters']
  },
  
  // Damage type (for offensive spells)
  damageType: { 
    type: String, 
    default: '',
    enum: ['', 'Fire', 'Ice', 'Lightning', 'Physical', 'Poison', 'Dark', 'Light', 'Mental', 'Energy'],
    trim: true
  },
  
  // Whether spell requires concentration
  concentration: { 
    type: Boolean, 
    default: false 
  },
  
  // Whether spell can be cast as a ritual
  ritual: { 
    type: Boolean, 
    default: false 
  },
  
  // Tags for categorization
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
SpellSchema.virtual('level').get(function() {
  return this.circle; // Alias for circle
});

SpellSchema.virtual('isCantrip').get(function() {
  return this.circle === 0; // For future expansion if cantrips are added
});

SpellSchema.virtual('componentsList').get(function() {
  const components = [];
  if (this.components.verbal) components.push('V');
  if (this.components.somatic) components.push('S');
  if (this.components.material) components.push(`M (${this.components.material})`);
  return components.join(', ') || 'None';
});

SpellSchema.virtual('circleText').get(function() {
  const circleNames = {
    1: '1st Circle',
    2: '2nd Circle', 
    3: '3rd Circle',
    4: '4th Circle',
    5: '5th Circle'
  };
  return circleNames[this.circle] || `${this.circle} Circle`;
});

// Instance methods
SpellSchema.methods.getManaCostForLevel = function(casterLevel) {
  // Base mana cost, could be modified by caster level in future
  return this.manaCost;
};

SpellSchema.methods.hasComponent = function(componentType) {
  const validComponents = ['verbal', 'somatic', 'material'];
  if (!validComponents.includes(componentType)) {
    throw new Error(`Invalid component type: ${componentType}`);
  }
  
  if (componentType === 'material') {
    return this.components.material !== '';
  }
  
  return this.components[componentType];
};

SpellSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
  return this;
};

SpellSchema.methods.removeTag = function(tag) {
  const index = this.tags.indexOf(tag);
  if (index > -1) {
    this.tags.splice(index, 1);
  }
  return this;
};

// Static methods
SpellSchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

SpellSchema.statics.findByCircle = function(circle) {
  return this.find({ circle: circle });
};

SpellSchema.statics.findBySchool = function(school) {
  return this.find({ school: new RegExp(school, 'i') });
};

SpellSchema.statics.findByManaCost = function(minCost, maxCost) {
  const query = {};
  if (minCost !== undefined) query.manaCost = { $gte: minCost };
  if (maxCost !== undefined) {
    if (query.manaCost) {
      query.manaCost.$lte = maxCost;
    } else {
      query.manaCost = { $lte: maxCost };
    }
  }
  return this.find(query);
};

SpellSchema.statics.findByTag = function(tag) {
  return this.find({ tags: tag });
};

SpellSchema.statics.findConcentrationSpells = function() {
  return this.find({ concentration: true });
};

SpellSchema.statics.findRitualSpells = function() {
  return this.find({ ritual: true });
};

SpellSchema.statics.getSpellsByCircle = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$circle',
        spells: { $push: '$$ROOT' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

SpellSchema.statics.getSpellsBySchool = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$school',
        spells: { $push: '$$ROOT' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Pre-save middleware
SpellSchema.pre('save', function(next) {
  // Ensure tags are unique
  this.tags = [...new Set(this.tags)];
  
  // Capitalize first letter of school
  if (this.school) {
    this.school = this.school.charAt(0).toUpperCase() + this.school.slice(1).toLowerCase();
  }
  
  next();
});

// Validation
SpellSchema.path('manaCost').validate(function(manaCost) {
  // Mana cost should generally scale with circle level
  // This is a soft validation - warns but doesn't prevent save
  if (this.circle && manaCost < this.circle) {
    console.warn(`Warning: Spell ${this.name} has unusually low mana cost (${manaCost}) for circle ${this.circle}`);
  }
  return true;
}, 'Mana cost validation');

// Indexes for better performance
SpellSchema.index({ name: 1 });
SpellSchema.index({ circle: 1 });
SpellSchema.index({ school: 1 });
SpellSchema.index({ manaCost: 1 });
SpellSchema.index({ tags: 1 });
SpellSchema.index({ concentration: 1 });
SpellSchema.index({ ritual: 1 });
SpellSchema.index({ createdAt: -1 });

// Compound indexes
SpellSchema.index({ circle: 1, school: 1 });
SpellSchema.index({ circle: 1, manaCost: 1 });

// Create and export the model
const Spell = mongoose.model('Spell', SpellSchema);

module.exports = Spell;