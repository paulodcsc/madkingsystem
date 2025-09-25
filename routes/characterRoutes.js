const express = require('express');
const CharacterController = require('../controllers/CharacterController');

const router = express.Router();

/**
 * Character Routes
 * Defines all character-related endpoints and connects them to controller methods
 */

// GET /characters - Get all characters
router.get('/', CharacterController.getAllCharacters);

// GET /characters/:id - Get character by ID with full details
router.get('/:id', CharacterController.getCharacterById);

// POST /characters - Create new character
router.post('/', CharacterController.createCharacter);

// PUT /characters/:id - Update character by ID
router.put('/:id', CharacterController.updateCharacter);

// POST /characters/:id/levelup - Level up character
router.post('/:id/levelup', CharacterController.levelUpCharacter);

// POST /characters/:id/spells - Add spell to character
router.post('/:id/spells', CharacterController.addSpellToCharacter);

// POST /characters/:id/items - Add item to character
router.post('/:id/items', CharacterController.addItemToCharacter);

// POST /characters/:id/equip - Equip item on character
router.post('/:id/equip', CharacterController.equipItem);

// POST /characters/:id/unequip - Unequip item from character
router.post('/:id/unequip', CharacterController.unequipItem);

// POST /characters/:id/roll/:skillName - Roll skill check for character
router.post('/:id/roll/:skillName', CharacterController.rollSkillCheck);

// DELETE /characters/:id - Delete character by ID
router.delete('/:id', CharacterController.deleteCharacter);

module.exports = router;