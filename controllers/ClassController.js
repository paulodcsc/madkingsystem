const Class = require('../models/Class');

/**
 * Class Controller
 * Handles all class-related business logic and database operations
 */

class ClassController {
  /**
   * Get all classes
   * GET /classes
   */
  static async getAllClasses(req, res) {
    try {
      const classes = await Class.find().sort({ createdAt: -1 });
      
      res.json({
        success: true,
        count: classes.length,
        data: classes
      });
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while fetching classes',
        message: error.message
      });
    }
  }

  /**
   * Get class by ID
   * GET /classes/:id
   */
  static async getClassById(req, res) {
    try {
      const classData = await Class.findById(req.params.id);
      
      if (!classData) {
        return res.status(404).json({
          success: false,
          error: 'Class not found'
        });
      }
      
      res.json({
        success: true,
        data: classData
      });
    } catch (error) {
      console.error('Error fetching class:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid class ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while fetching class',
        message: error.message
      });
    }
  }

  /**
   * Create new class
   * POST /classes
   */
  static async createClass(req, res) {
    try {
      const classData = new Class(req.body);
      
      // Save to database (validation happens automatically)
      const savedClass = await classData.save();
      
      res.status(201).json({
        success: true,
        message: 'Class created successfully',
        data: savedClass
      });
    } catch (error) {
      console.error('Error creating class:', error);
      
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
          error: 'Class name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while creating class',
        message: error.message
      });
    }
  }

  /**
   * Update class by ID
   * PUT /classes/:id
   */
  static async updateClass(req, res) {
    try {
      const classData = await Class.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
          new: true, // Return the updated document
          runValidators: true // Run schema validators on update
        }
      );
      
      if (!classData) {
        return res.status(404).json({
          success: false,
          error: 'Class not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Class updated successfully',
        data: classData
      });
    } catch (error) {
      console.error('Error updating class:', error);
      
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
          error: 'Class name already exists'
        });
      }
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid class ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while updating class',
        message: error.message
      });
    }
  }

  /**
   * Delete class by ID
   * DELETE /classes/:id
   */
  static async deleteClass(req, res) {
    try {
      const classData = await Class.findByIdAndDelete(req.params.id);
      
      if (!classData) {
        return res.status(404).json({
          success: false,
          error: 'Class not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Class deleted successfully',
        data: classData
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid class ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while deleting class',
        message: error.message
      });
    }
  }
}

module.exports = ClassController;