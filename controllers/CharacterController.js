const Character = require('../models/Character');
const Class = require('../models/Class');
const Race = require('../models/Race');
const Origin = require('../models/Origin');
const Spell = require('../models/Spell');
const Item = require('../models/Item');

/**
 * Character Controller
 * Handles all character sheet-related business logic and database operations
 */

class CharacterController {
  /**
   * Get all characters
   * GET /characters
   */
  static async getAllCharacters(req, res) {
    try {
      const characters = await Character.find()
        .populate('race', 'name abilities bonuses subraces')
        .populate('class', 'name description hpBonusPerLevel manaBonusPerLevel abilities subclasses')
        .populate('origin', 'name description abilities bonuses skills')
        .populate('spells', 'name circle description manaCost')
        .populate('items.item', 'name description category bonuses requirements')
        .populate('equippedSlots.mainHand', 'name description bonuses weaponHandling')
        .populate('equippedSlots.offHand', 'name description bonuses weaponHandling')
        .populate('equippedSlots.chest', 'name description bonuses')
        .populate('equippedSlots.boots', 'name description bonuses')
        .populate('equippedSlots.gloves', 'name description bonuses')
        .populate('equippedSlots.headgear', 'name description bonuses')
        .populate('equippedSlots.cape', 'name description bonuses')
        .populate('equippedSlots.necklace', 'name description bonuses')
        .populate('equippedSlots.ring', 'name description bonuses')
        .populate('equippedSlots.other', 'name description bonuses')
        .sort({ createdAt: -1 });
      
      res.json({
        success: true,
        count: characters.length,
        data: characters
      });
    } catch (error) {
      console.error('Error fetching characters:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while fetching characters',
        message: error.message
      });
    }
  }

  /**
   * Get character by ID with full details including available abilities and spells
   * GET /characters/:id
   */
  static async getCharacterById(req, res) {
    try {
      const character = await Character.findById(req.params.id)
        .populate('race', 'name description abilities bonuses subraces skills')
        .populate('class', 'name description hpBonusPerLevel manaBonusPerLevel abilities subclasses baseSpeed')
        .populate('origin', 'name description abilities bonuses skills')
        .populate('spells', 'name circle description manaCost duration range target components')
        .populate('items.item', 'name description category type bonuses requirements abilities');
      
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      // Get available abilities and spells for current level
      const availableAbilities = await character.getAvailableAbilities();
      const availableSpells = await character.getAvailableSpells();
      
      // Calculate skill modifiers for all skills
      const skillModifiers = {};
      const allSkills = [
        'heavyWeapons', 'muscle', 'athletics', 'endurance',
        'lightWeapons', 'rangedWeapons', 'stealth', 'acrobatics', 'legerdemain',
        'negotiation', 'deception', 'intimidation', 'seduction',
        'arcana', 'lore', 'investigation', 'nature', 'insight'
      ];
      
      allSkills.forEach(skill => {
        skillModifiers[skill] = character.getSkillModifier(skill);
      });
      
      // Calculate total AC from equipped items
      const totalAC = await character.calculateTotalAC();
      
      res.json({
        success: true,
        data: {
          ...character.toJSON(),
          availableAbilities,
          availableSpells,
          skillModifiers,
          totalAC,
          maxSpellCircle: Math.min(5, Math.ceil(character.level / 2))
        }
      });
    } catch (error) {
      console.error('Error fetching character:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while fetching character',
        message: error.message
      });
    }
  }

  /**
   * Create new character
   * POST /characters
   */
  static async createCharacter(req, res) {
    try {
      // Validate required references exist
      const { race, class: characterClass, origin } = req.body;
      
      if (race) {
        const raceExists = await Race.findById(race);
        if (!raceExists) {
          return res.status(400).json({
            success: false,
            error: 'Invalid race ID provided'
          });
        }
      }
      
      if (characterClass) {
        const classExists = await Class.findById(characterClass);
        if (!classExists) {
          return res.status(400).json({
            success: false,
            error: 'Invalid class ID provided'
          });
        }
      }
      
      if (origin) {
        const originExists = await Origin.findById(origin);
        if (!originExists) {
          return res.status(400).json({
            success: false,
            error: 'Invalid origin ID provided'
          });
        }
      }
      
      // Validate spells if provided
      if (req.body.spells && req.body.spells.length > 0) {
        const spellsExist = await Spell.find({ _id: { $in: req.body.spells } });
        if (spellsExist.length !== req.body.spells.length) {
          return res.status(400).json({
            success: false,
            error: 'One or more invalid spell IDs provided'
          });
        }
      }
      
      // Validate items if provided
      if (req.body.items && req.body.items.length > 0) {
        const itemIds = req.body.items.map(item => item.item);
        const itemsExist = await Item.find({ _id: { $in: itemIds } });
        if (itemsExist.length !== itemIds.length) {
          return res.status(400).json({
            success: false,
            error: 'One or more invalid item IDs provided'
          });
        }
      }
      
      const character = new Character(req.body);
      await character.save();
      
      // Populate the created character
      await character.populate([
        { path: 'race', select: 'name abilities bonuses' },
        { path: 'class', select: 'name description hpBonusPerLevel manaBonusPerLevel abilities subclasses' },
        { path: 'origin', select: 'name description abilities bonuses skills' },
        { path: 'spells', select: 'name circle description manaCost' },
        { path: 'items.item', select: 'name description category bonuses' }
      ]);
      
      res.status(201).json({
        success: true,
        data: character
      });
    } catch (error) {
      console.error('Error creating character:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: Object.values(error.errors).map(err => err.message)
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while creating character',
        message: error.message
      });
    }
  }

  /**
   * Update character by ID
   * PUT /characters/:id
   */
  static async updateCharacter(req, res) {
    try {
      // Validate references if they are being updated
      if (req.body.race) {
        const raceExists = await Race.findById(req.body.race);
        if (!raceExists) {
          return res.status(400).json({
            success: false,
            error: 'Invalid race ID provided'
          });
        }
      }
      
      if (req.body.class) {
        const classExists = await Class.findById(req.body.class);
        if (!classExists) {
          return res.status(400).json({
            success: false,
            error: 'Invalid class ID provided'
          });
        }
      }
      
      if (req.body.origin) {
        const originExists = await Origin.findById(req.body.origin);
        if (!originExists) {
          return res.status(400).json({
            success: false,
            error: 'Invalid origin ID provided'
          });
        }
      }
      
      const character = await Character.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
          new: true, 
          runValidators: true 
        }
      ).populate([
        { path: 'race', select: 'name abilities bonuses' },
        { path: 'class', select: 'name description hpBonusPerLevel manaBonusPerLevel abilities subclasses' },
        { path: 'origin', select: 'name description abilities bonuses skills' },
        { path: 'spells', select: 'name circle description manaCost' },
        { path: 'items.item', select: 'name description category bonuses' }
      ]);
      
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      res.json({
        success: true,
        data: character
      });
    } catch (error) {
      console.error('Error updating character:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: Object.values(error.errors).map(err => err.message)
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Server error while updating character',
        message: error.message
      });
    }
  }

  /**
   * Level up character
   * POST /characters/:id/levelup
   */
  static async levelUpCharacter(req, res) {
    try {
      const character = await Character.findById(req.params.id)
        .populate('class', 'name hpBonusPerLevel manaBonusPerLevel abilities subclasses');
      
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      if (character.level >= 10) {
        return res.status(400).json({
          success: false,
          error: 'Character is already at maximum level (10)'
        });
      }
      
      const oldLevel = character.level;
      await character.levelUp();
      await character.save();
      
      // Re-populate to get full data
      await character.populate([
        { path: 'race', select: 'name abilities bonuses' },
        { path: 'class', select: 'name description hpBonusPerLevel manaBonusPerLevel abilities subclasses' },
        { path: 'origin', select: 'name description abilities bonuses skills' },
        { path: 'spells', select: 'name circle description manaCost' }
      ]);
      
      // Get new abilities and spells available at this level
      const availableAbilities = await character.getAvailableAbilities();
      const availableSpells = await character.getAvailableSpells();
      
      // Find newly unlocked abilities
      const newAbilities = availableAbilities.filter(ability => ability.level === character.level);
      
      res.json({
        success: true,
        message: `Character leveled up from ${oldLevel} to ${character.level}!`,
        data: {
          character: character.toJSON(),
          newAbilities,
          availableSpells,
          maxSpellCircle: Math.min(5, Math.ceil(character.level / 2))
        }
      });
    } catch (error) {
      console.error('Error leveling up character:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while leveling up character',
        message: error.message
      });
    }
  }

  /**
   * Add spell to character
   * POST /characters/:id/spells
   */
  static async addSpellToCharacter(req, res) {
    try {
      const { spellId } = req.body;
      
      const character = await Character.findById(req.params.id);
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      const spell = await Spell.findById(spellId);
      if (!spell) {
        return res.status(404).json({
          success: false,
          error: 'Spell not found'
        });
      }
      
      // Check if character can learn this spell (based on spell circle and character level)
      const maxSpellCircle = Math.min(5, Math.ceil(character.level / 2));
      if (spell.circle > maxSpellCircle) {
        return res.status(400).json({
          success: false,
          error: `Character level ${character.level} can only access spells up to circle ${maxSpellCircle}`
        });
      }
      
      // Check if character already knows this spell
      if (character.spells.includes(spellId)) {
        return res.status(400).json({
          success: false,
          error: 'Character already knows this spell'
        });
      }
      
      character.spells.push(spellId);
      await character.save();
      
      await character.populate('spells', 'name circle description manaCost');
      
      res.json({
        success: true,
        message: 'Spell added to character',
        data: character.spells
      });
    } catch (error) {
      console.error('Error adding spell to character:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while adding spell',
        message: error.message
      });
    }
  }

  /**
   * Add item to character
   * POST /characters/:id/items
   */
  static async addItemToCharacter(req, res) {
    try {
      const { itemId, quantity = 1, equipped = false } = req.body;
      
      const character = await Character.findById(req.params.id);
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Item not found'
        });
      }
      
      // Check if character already has this item
      const existingItemIndex = character.items.findIndex(
        charItem => charItem.item.toString() === itemId
      );
      
      if (existingItemIndex !== -1) {
        // Add to existing quantity
        character.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        character.items.push({
          item: itemId,
          quantity,
          equipped
        });
      }
      
      await character.save();
      await character.populate('items.item', 'name description category bonuses');
      
      res.json({
        success: true,
        message: 'Item added to character',
        data: character.items
      });
    } catch (error) {
      console.error('Error adding item to character:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while adding item',
        message: error.message
      });
    }
  }

  /**
   * Equip item on character
   * POST /characters/:id/equip
   */
  static async equipItem(req, res) {
    try {
      const { itemId } = req.body;
      
      const character = await Character.findById(req.params.id);
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      await character.equipItem(itemId);
      await character.save();
      
      // Populate the updated character
      await character.populate([
        'items.item',
        'equippedSlots.mainHand',
        'equippedSlots.offHand',
        'equippedSlots.chest',
        'equippedSlots.boots',
        'equippedSlots.gloves',
        'equippedSlots.headgear',
        'equippedSlots.cape',
        'equippedSlots.necklace',
        'equippedSlots.ring',
        'equippedSlots.other'
      ]);
      
      res.json({
        success: true,
        message: 'Item equipped successfully',
        data: {
          character,
          totalAC: await character.calculateTotalAC()
        }
      });
    } catch (error) {
      console.error('Error equipping item:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Unequip item from character
   * POST /characters/:id/unequip
   */
  static async unequipItem(req, res) {
    try {
      const { itemId } = req.body;
      
      const character = await Character.findById(req.params.id);
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      await character.unequipItem(itemId);
      await character.save();
      
      // Populate the updated character
      await character.populate([
        'items.item',
        'equippedSlots.mainHand',
        'equippedSlots.offHand',
        'equippedSlots.chest',
        'equippedSlots.boots',
        'equippedSlots.gloves',
        'equippedSlots.headgear',
        'equippedSlots.cape',
        'equippedSlots.necklace',
        'equippedSlots.ring',
        'equippedSlots.other'
      ]);
      
      res.json({
        success: true,
        message: 'Item unequipped successfully',
        data: {
          character,
          totalAC: await character.calculateTotalAC()
        }
      });
    } catch (error) {
      console.error('Error unequipping item:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Roll skill check for character
   * POST /characters/:id/roll/:skillName
   */
  static async rollSkillCheck(req, res) {
    try {
      const character = await Character.findById(req.params.id);
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      const { skillName } = req.params;
      const validSkills = [
        'heavyWeapons', 'muscle', 'athletics', 'endurance',
        'lightWeapons', 'rangedWeapons', 'stealth', 'acrobatics', 'legerdemain',
        'negotiation', 'deception', 'intimidation', 'seduction',
        'arcana', 'lore', 'investigation', 'nature', 'insight'
      ];
      
      if (!validSkills.includes(skillName)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid skill name'
        });
      }
      
      const rollResult = character.rollSkillCheck(skillName);
      
      res.json({
        success: true,
        data: rollResult
      });
    } catch (error) {
      console.error('Error rolling skill check:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while rolling skill check',
        message: error.message
      });
    }
  }

  /**
   * Delete character by ID
   * DELETE /characters/:id
   */
  static async deleteCharacter(req, res) {
    try {
      const character = await Character.findByIdAndDelete(req.params.id);
      
      if (!character) {
        return res.status(404).json({
          success: false,
          error: 'Character not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Character deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting character:', error);
      res.status(500).json({
        success: false,
        error: 'Server error while deleting character',
        message: error.message
      });
    }
  }
}

module.exports = CharacterController;