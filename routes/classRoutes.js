const express = require('express');
const ClassController = require('../controllers/ClassController');

const router = express.Router();

/**
 * Class Routes
 * Defines all class-related endpoints and connects them to controller methods
 */

// GET /classes - Get all classes
router.get('/', ClassController.getAllClasses);

// GET /classes/:id - Get class by ID
router.get('/:id', ClassController.getClassById);

// POST /classes - Create new class
router.post('/', ClassController.createClass);

// PUT /classes/:id - Update class by ID
router.put('/:id', ClassController.updateClass);

// DELETE /classes/:id - Delete class by ID
router.delete('/:id', ClassController.deleteClass);

module.exports = router;