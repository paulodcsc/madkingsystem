const Race = require('../models/Race');

/**
 * Race Controller
 * Handles all race-related business logic and database operations
 */

class RaceController {
  /**
   * Get all races
   * GET /races
   */
  static async getAllRaces(req, res) {
    try {
      const races = await Race.find().sort({ createdAt: -1 });
      
      res.json({
        success: true,
        count: races.length,
        data: races
      });
    } catch (error) {
      console.error('Error fetching races:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while fetching races',
        message: error.message
      });
    }
  }

  /**
   * Get race by ID
   * GET /races/:id
   */
  static async getRaceById(req, res) {
    try {
      const race = await Race.findById(req.params.id);
      
      if (!race) {
        return res.status(404).json({
          success: false,
          error: 'Race not found'
        });
      }
      
      res.json({
        success: true,
        data: race
      });
    } catch (error) {
      console.error('Error fetching race:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid race ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while fetching race',
        message: error.message
      });
    }
  }

  /**
   * Create new race
   * POST /races
   */
  static async createRace(req, res) {
    try {
      const race = new Race(req.body);
      
      // Save to database (validation happens automatically)
      const savedRace = await race.save();
      
      res.status(201).json({
        success: true,
        message: 'Race created successfully',
        data: savedRace
      });
    } catch (error) {
      console.error('Error creating race:', error);
      
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
          error: 'Race name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while creating race',
        message: error.message
      });
    }
  }

  /**
   * Update race by ID
   * PUT /races/:id
   */
  static async updateRace(req, res) {
    try {
      const race = await Race.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
          new: true, // Return the updated document
          runValidators: true // Run schema validators on update
        }
      );
      
      if (!race) {
        return res.status(404).json({
          success: false,
          error: 'Race not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Race updated successfully',
        data: race
      });
    } catch (error) {
      console.error('Error updating race:', error);
      
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
          error: 'Race name already exists'
        });
      }
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid race ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while updating race',
        message: error.message
      });
    }
  }

  /**
   * Delete race by ID
   * DELETE /races/:id
   */
  static async deleteRace(req, res) {
    try {
      const race = await Race.findByIdAndDelete(req.params.id);
      
      if (!race) {
        return res.status(404).json({
          success: false,
          error: 'Race not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Race deleted successfully',
        data: race
      });
    } catch (error) {
      console.error('Error deleting race:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid race ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while deleting race',
        message: error.message
      });
    }
  }
}

module.exports = RaceController;