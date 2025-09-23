const express = require('express');
const CharacterController = require('../controllers/CharacterController');

const router = express.Router();

/**
 * Character Routes
 * Defines all character-related endpoints and connects them to controller methods
 */

// GET /characters - Get all characters
router.get('/', CharacterController.getAllCharacters);

// GET /characters/:id - Get character by ID
router.get('/:id', CharacterController.getCharacterById);

// POST /characters - Create new character
router.post('/', CharacterController.createCharacter);

// PUT /characters/:id - Update character by ID
router.put('/:id', CharacterController.updateCharacter);

// DELETE /characters/:id - Delete character by ID
router.delete('/:id', CharacterController.deleteCharacter);

module.exports = router;