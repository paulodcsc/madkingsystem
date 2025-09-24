const express = require('express');
const OriginController = require('../controllers/OriginController');

const router = express.Router();

/**
 * Origin Routes
 * Defines all origin-related endpoints and connects them to controller methods
 */

// GET /origins - Get all origins
router.get('/', OriginController.getAllOrigins);

// GET /origins/:id - Get origin by ID
router.get('/:id', OriginController.getOriginById);

// POST /origins - Create new origin
router.post('/', OriginController.createOrigin);

// PUT /origins/:id - Update origin by ID
router.put('/:id', OriginController.updateOrigin);

// DELETE /origins/:id - Delete origin by ID
router.delete('/:id', OriginController.deleteOrigin);

module.exports = router;