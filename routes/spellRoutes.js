const express = require('express');
const SpellController = require('../controllers/SpellController');

const router = express.Router();

/**
 * Spell Routes
 * Defines all spell-related endpoints and connects them to controller methods
 */

// GET /spells - Get all spells
router.get('/', SpellController.getAllSpells);

// GET /spells/:id - Get spell by ID
router.get('/:id', SpellController.getSpellById);

// POST /spells - Create new spell
router.post('/', SpellController.createSpell);

// PUT /spells/:id - Update spell by ID
router.put('/:id', SpellController.updateSpell);

// DELETE /spells/:id - Delete spell by ID
router.delete('/:id', SpellController.deleteSpell);

module.exports = router;