const Spell = require('../models/Spell');

/**
 * Spell Controller
 * Handles all spell-related business logic and database operations
 */

class SpellController {
  /**
   * Get all spells
   * GET /spells
   */
  static async getAllSpells(req, res) {
    try {
      const spells = await Spell.find().sort({ createdAt: -1 });
      
      res.json({
        success: true,
        count: spells.length,
        data: spells
      });
    } catch (error) {
      console.error('Error fetching spells:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while fetching spells',
        message: error.message
      });
    }
  }

  /**
   * Get spell by ID
   * GET /spells/:id
   */
  static async getSpellById(req, res) {
    try {
      const spell = await Spell.findById(req.params.id);
      
      if (!spell) {
        return res.status(404).json({
          success: false,
          error: 'Spell not found'
        });
      }
      
      res.json({
        success: true,
        data: spell
      });
    } catch (error) {
      console.error('Error fetching spell:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid spell ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while fetching spell',
        message: error.message
      });
    }
  }

  /**
   * Create new spell
   * POST /spells
   */
  static async createSpell(req, res) {
    try {
      const spell = new Spell(req.body);
      
      // Save to database (validation happens automatically)
      const savedSpell = await spell.save();
      
      res.status(201).json({
        success: true,
        message: 'Spell created successfully',
        data: savedSpell
      });
    } catch (error) {
      console.error('Error creating spell:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: errors
        });
      }
      
      // Handle duplicate key error (unique constraint)
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          error: 'Spell name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while creating spell',
        message: error.message
      });
    }
  }

  /**
   * Update spell by ID
   * PUT /spells/:id
   */
  static async updateSpell(req, res) {
    try {
      const spell = await Spell.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
          new: true, // Return the updated document
          runValidators: true // Run schema validators on update
        }
      );
      
      if (!spell) {
        return res.status(404).json({
          success: false,
          error: 'Spell not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Spell updated successfully',
        data: spell
      });
    } catch (error) {
      console.error('Error updating spell:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          errors: errors
        });
      }
      
      // Handle duplicate key error (unique constraint)
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          error: 'Spell name already exists'
        });
      }
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid spell ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while updating spell',
        message: error.message
      });
    }
  }

  /**
   * Delete spell by ID
   * DELETE /spells/:id
   */
  static async deleteSpell(req, res) {
    try {
      const spell = await Spell.findByIdAndDelete(req.params.id);
      
      if (!spell) {
        return res.status(404).json({
          success: false,
          error: 'Spell not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Spell deleted successfully',
        data: spell
      });
    } catch (error) {
      console.error('Error deleting spell:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid spell ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while deleting spell',
        message: error.message
      });
    }
  }
}

module.exports = SpellController;