const Item = require('../models/Item');

/**
 * Item Controller
 * Handles all item-related business logic and database operations
 */

class ItemController {
  /**
   * Get all items
   * GET /items
   */
  static async getAllItems(req, res) {
    try {
      const items = await Item.find().sort({ createdAt: -1 });
      
      res.json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while fetching items',
        message: error.message
      });
    }
  }

  /**
   * Get item by ID
   * GET /items/:id
   */
  static async getItemById(req, res) {
    try {
      const item = await Item.findById(req.params.id);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Item not found'
        });
      }
      
      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      console.error('Error fetching item:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid item ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while fetching item',
        message: error.message
      });
    }
  }

  /**
   * Create new item
   * POST /items
   */
  static async createItem(req, res) {
    try {
      const item = new Item(req.body);
      
      // Save to database (validation happens automatically)
      const savedItem = await item.save();
      
      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: savedItem
      });
    } catch (error) {
      console.error('Error creating item:', error);
      
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
          error: 'Item name already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while creating item',
        message: error.message
      });
    }
  }

  /**
   * Update item by ID
   * PUT /items/:id
   */
  static async updateItem(req, res) {
    try {
      const item = await Item.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
          new: true, // Return the updated document
          runValidators: true // Run schema validators on update
        }
      );
      
      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Item not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Item updated successfully',
        data: item
      });
    } catch (error) {
      console.error('Error updating item:', error);
      
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
          error: 'Item name already exists'
        });
      }
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid item ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while updating item',
        message: error.message
      });
    }
  }

  /**
   * Delete item by ID
   * DELETE /items/:id
   */
  static async deleteItem(req, res) {
    try {
      const item = await Item.findByIdAndDelete(req.params.id);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Item not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Item deleted successfully',
        data: item
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid item ID format'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while deleting item',
        message: error.message
      });
    }
  }
}

module.exports = ItemController;