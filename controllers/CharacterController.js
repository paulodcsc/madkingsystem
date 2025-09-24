const Character = require('../models/Character');
const Race = require('../models/Race');
const Class = require('../models/Class');
const Origin = require('../models/Origin');
const Spell = require('../models/Spell');

/**
 * Character Controller
 * Handles all character-related business logic and database operations
 */

class CharacterController {
  /**
   * Get all characters
   * GET /characters
   */
  static async getAllCharacters(req, res) {
    try {
      const characters = await Character.findWithFullData().sort({ createdAt: -1 });
      
      res.json({
        success: true,
        count: characters.length,
        data: characters
      });
    } catch (error) {
      console.error('Error fetching characters:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while fetching characters',
        message: error.message
      });
    }
  }

  /**
   * Get character by ID
   * GET /characters/:id
   */
  static async getCharacterById(req, res) {
    try {
      const character = await Character.findById(req.params.id)
        .populate('class')
        .populate('race.raceId') 
        .populate('origin')
        .populate('spells.spellId');
      
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      res.json({
        success: true,
        data: character
      });
    } catch (error) {
      console.error('Error fetching character:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid character ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while fetching character',
        message: error.message
      });
    }
  }

  /**
   * Create new character
   * POST /characters
   * Now accepts only IDs and automatically fetches related data
   */
  static async createCharacter(req, res) {
    try {
      const characterData = req.body;
      
      // Validate that required IDs are provided
      if (!characterData.race) {
        return res.status(400).json({
          success: false,
          error: 'Race ID is required'
        });
      }
      
      if (!characterData.class) {
        return res.status(400).json({
          success: false,
          error: 'Class ID is required'
        });
      }
      
      if (!characterData.origin) {
        return res.status(400).json({
          success: false,
          error: 'Origin ID is required'
        });
      }
      
      // Validate that the referenced entities exist
      const [race, characterClass, origin] = await Promise.all([
        Race.findById(characterData.race),
        Class.findById(characterData.class),
        Origin.findById(characterData.origin)
      ]);
      
      if (!race) {
        return res.status(400).json({
          success: false,
          error: 'Invalid race ID - race not found'
        });
      }
      
      if (!characterClass) {
        return res.status(400).json({
          success: false,
          error: 'Invalid class ID - class not found'
        });
      }
      
      if (!origin) {
        return res.status(400).json({
          success: false,
          error: 'Invalid origin ID - origin not found'
        });
      }
      
      // Validate subrace if provided
      if (characterData.subrace) {
        const hasSubrace = race.hasSubrace(characterData.subrace);
        if (!hasSubrace) {
          return res.status(400).json({
            success: false,
            error: `Subrace '${characterData.subrace}' not found for race '${race.name}'`
          });
        }
      }
      
      // Transform the flat structure to the nested structure expected by the model
      const transformedData = {
        ...characterData,
        race: {
          raceId: characterData.race,
          subraceName: characterData.subrace || ''
        },
        subclass: {
          name: characterData.subclass || '',
          bonuses: [],
          abilities: []
        }
      };
      
      // Remove the flat fields that were transformed
      delete transformedData.subrace;
      
      // Validate spells if provided
      if (characterData.spells && characterData.spells.length > 0) {
        const spellIds = characterData.spells.map(spell => spell.spellId);
        const spells = await Spell.find({ _id: { $in: spellIds } });
        
        if (spells.length !== spellIds.length) {
          const foundSpellIds = spells.map(spell => spell._id.toString());
          const invalidSpellIds = spellIds.filter(id => !foundSpellIds.includes(id.toString()));
          return res.status(400).json({
            success: false,
            error: `Invalid spell IDs: ${invalidSpellIds.join(', ')}`
          });
        }
      }
      
      // Create the character with transformed data
      const character = new Character(transformedData);
      
      // Save to database (validation happens automatically)
      const savedCharacter = await character.save();
      
      // Return the character with populated data
      const populatedCharacter = await Character.findById(savedCharacter._id)
        .populate('class')
        .populate('race.raceId') 
        .populate('origin')
        .populate('spells.spellId');
      
      res.status(201).json({
        success: true,
        message: 'Character created successfully',
        data: populatedCharacter
      });
    } catch (error) {
      console.error('Error creating character:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: errors
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while creating character',
        message: error.message
      });
    }
  }

  /**
   * Update character by ID
   * PUT /characters/:id
   */
  static async updateCharacter(req, res) {
    try {
      const character = await Character.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
          new: true, // Return the updated document
          runValidators: true // Run schema validators on update
        }
      )
      .populate('class')
      .populate('race.raceId') 
      .populate('origin')
      .populate('spells.spellId');
      
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Character updated successfully',
        data: character
      });
    } catch (error) {
      console.error('Error updating character:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: errors
        });
      }
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid character ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while updating character',
        message: error.message
      });
    }
  }

  /**
   * Delete character by ID
   * DELETE /characters/:id
   */
  static async deleteCharacter(req, res) {
    try {
      const character = await Character.findByIdAndDelete(req.params.id);
      
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Character deleted successfully',
        data: character
      });
    } catch (error) {
      console.error('Error deleting character:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid character ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while deleting character',
        message: error.message
      });
    }
  }
}

module.exports = CharacterController;