const Origin = require('../models/Origin');

/**
 * Origin Controller
 * Handles all origin-related business logic and database operations
 */

class OriginController {
  /**
   * Get all origins
   * GET /origins
   */
  static async getAllOrigins(req, res) {
    try {
      const origins = await Origin.find().sort({ createdAt: -1 });
      
      res.json({
        success: true,
        count: origins.length,
        data: origins
      });
    } catch (error) {
      console.error('Error fetching origins:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while fetching origins',
        message: error.message
      });
    }
  }

  /**
   * Get origin by ID
   * GET /origins/:id
   */
  static async getOriginById(req, res) {
    try {
      const origin = await Origin.findById(req.params.id);
      
      if (!origin) {
        return res.status(404).json({
          success: false,
          error: 'Origin not found'
        });
      }
      
      res.json({
        success: true,
        data: origin
      });
    } catch (error) {
      console.error('Error fetching origin:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid origin ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while fetching origin',
        message: error.message
      });
    }
  }

  /**
   * Create new origin
   * POST /origins
   */
  static async createOrigin(req, res) {
    try {
      const origin = new Origin(req.body);
      
      // Save to database (validation happens automatically)
      const savedOrigin = await origin.save();
      
      res.status(201).json({
        success: true,
        message: 'Origin created successfully',
        data: savedOrigin
      });
    } catch (error) {
      console.error('Error creating origin:', error);
      
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
          error: 'Origin name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while creating origin',
        message: error.message
      });
    }
  }

  /**
   * Update origin by ID
   * PUT /origins/:id
   */
  static async updateOrigin(req, res) {
    try {
      const origin = await Origin.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
          new: true, // Return the updated document
          runValidators: true // Run schema validators on update
        }
      );
      
      if (!origin) {
        return res.status(404).json({
          success: false,
          error: 'Origin not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Origin updated successfully',
        data: origin
      });
    } catch (error) {
      console.error('Error updating origin:', error);
      
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
          error: 'Origin name already exists'
        });
      }
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid origin ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while updating origin',
        message: error.message
      });
    }
  }

  /**
   * Delete origin by ID
   * DELETE /origins/:id
   */
  static async deleteOrigin(req, res) {
    try {
      const origin = await Origin.findByIdAndDelete(req.params.id);
      
      if (!origin) {
        return res.status(404).json({
          success: false,
          error: 'Origin not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Origin deleted successfully',
        data: origin
      });
    } catch (error) {
      console.error('Error deleting origin:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid origin ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while deleting origin',
        message: error.message
      });
    }
  }
}

module.exports = OriginController;