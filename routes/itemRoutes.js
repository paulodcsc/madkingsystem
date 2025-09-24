const express = require('express');
const ItemController = require('../controllers/ItemController');

const router = express.Router();

/**
 * Item Routes
 * Defines all item-related endpoints and connects them to controller methods
 */

// GET /items - Get all items
router.get('/', ItemController.getAllItems);

// GET /items/:id - Get item by ID
router.get('/:id', ItemController.getItemById);

// POST /items - Create new item
router.post('/', ItemController.createItem);

// PUT /items/:id - Update item by ID
router.put('/:id', ItemController.updateItem);

// DELETE /items/:id - Delete item by ID
router.delete('/:id', ItemController.deleteItem);

module.exports = router;