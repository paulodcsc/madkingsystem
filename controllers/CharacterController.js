const Character = require('../models/Character');

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
      const characters = await Character.find().sort({ createdAt: -1 });
      
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
      const character = await Character.findById(req.params.id);
      
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
   */
  static async createCharacter(req, res) {
    try {
      const character = new Character(req.body);
      
      // Save to database (validation happens automatically)
      const savedCharacter = await character.save();
      
      res.status(201).json({
        success: true,
        message: 'Character created successfully',
        data: savedCharacter
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
      );
      
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