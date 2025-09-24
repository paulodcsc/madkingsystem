const express = require('express');
const RaceController = require('../controllers/RaceController');

const router = express.Router();

/**
 * Race Routes
 * Defines all race-related endpoints and connects them to controller methods
 */

// GET /races - Get all races
router.get('/', RaceController.getAllRaces);

// GET /races/:id - Get race by ID
router.get('/:id', RaceController.getRaceById);

// POST /races - Create new race
router.post('/', RaceController.createRace);

// PUT /races/:id - Update race by ID
router.put('/:id', RaceController.updateRace);

// DELETE /races/:id - Delete race by ID
router.delete('/:id', RaceController.deleteRace);

module.exports = router;