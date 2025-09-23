# Mad King RPG Character Sheet API

A comprehensive Node.js backend API for managing RPG character sheets with MongoDB integration, featuring a dynamic class system with level-based abilities.

## Features

- **Dynamic Class System**: Pre-defined classes (Warrior, Rogue, Wizard) with subclasses
- **Level-Based Abilities**: Classes gain abilities on odd levels (1,3,5,7,9), subclasses on even levels (2,4,6,8,10)  
- **HP/Mana Scaling**: Different classes have unique HP and mana bonuses per level
- **Comprehensive Skills**: 20+ skills organized by ability scores (STR, DEX, INT, CHA)
- **MongoDB Integration**: Persistent data storage with Mongoose ODM
- **Rich Character Data**: Full character sheets with equipment, backstory, and calculated bonuses

## Installation

1. Install Node.js and MongoDB if you haven't already
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/madking-rpg
   PORT=3000
   ```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## Database Setup

The project includes sample data for classes. To seed your database:

```javascript
const { seedClasses } = require('./sample-classes');
await seedClasses(); // Run this once to populate classes
```

## API Endpoints

### Base URL: `http://localhost:3000`

### Characters API

#### GET /
Returns API information and available endpoints.

#### GET /characters
Get all characters with populated class data.

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

#### GET /characters/:id
Get a specific character by ID with full class and ability details.

#### POST /characters
Create a new character.

**Request body example:**
```json
{
  "name": "Lyra Thornfield",
  "race": {
    "name": "Human",
    "ability": [
      {
        "name": "Adaptable",
        "description": "Reroll one failed ability check per day",
        "source": "racial",
        "level": 1
      }
    ]
  },
  "class": {
    "name": "Warrior",
    "bonuses": [
      {"type": "STR", "value": 2},
      {"type": "AC", "value": 2}
    ],
    "abilities": [
      {
        "name": "Battle Hardened", 
        "description": "Recover HP equal to half your maximum HP once per combat",
        "source": "class",
        "level": 1
      }
    ],
    "skills": ["athletics", "intimidation"]
  },
  "subclass": {
    "name": "Berserker",
    "bonuses": [{"type": "STR", "value": 1}],
    "abilities": [
      {
        "name": "Frenzy",
        "description": "Enter a rage that grants +3 damage to all attacks but -2 AC for 4 rounds",
        "source": "subclass", 
        "level": 2
      }
    ]
  },
  "stats": {
    "str": 15,
    "dex": 12,
    "int": 10,
    "cha": 8
  },
  "level": 1,
  "hp": 22,
  "maxHp": 22,
  "ac": 12,
  "mana": 2,
  "skills": {
    "athletics": true,
    "intimidation": true,
    "heavyWeapons": true
  },
  "armor": {
    "name": "Leather armor",
    "acBonus": 2
  },
  "items": [
    {
      "name": "Greatsword",
      "description": "A heavy two-handed sword",
      "quantity": 1,
      "value": 50
    }
  ],
  "currency": 100,
  "backstory": "A farmer turned warrior after the Mad King's curse claimed her village."
}
```

#### PUT /characters/:id
Update an existing character by ID.

#### DELETE /characters/:id
Delete a character by ID.

### Classes API

#### GET /classes  
Get all available classes with their subclasses.

#### GET /classes/:id
Get a specific class by ID with full ability details.

#### GET /classes/name/:name
Find a class by name (case-insensitive).

#### POST /classes
Create a new class (admin functionality).

#### PUT /classes/:id
Update an existing class.

#### DELETE /classes/:id
Delete a class.

## Data Models

### Character Model
Characters include the following properties:
- **name**: Character name (required, max 100 chars)
- **race**: Race info with name and array of racial abilities
- **class**: Class reference with bonuses, abilities, and skills
- **subclass**: Subclass reference with additional bonuses and abilities  
- **origin**: Character background with bonuses, abilities, and skills
- **extraSkills**: Additional skill names beyond class/origin
- **skills**: Skill proficiency object with boolean values for each skill
- **stats**: STR, DEX, INT, CHA values (1-6 scale, default 1)
- **level**: Character level (1-10, affects ability access and bonuses)
- **hp/maxHp**: Hit points (calculated from class bonuses)
- **ac**: Armor class (base + equipment + bonuses)
- **mana**: Mana points (calculated from class bonuses, null if not magical)
- **armor**: Equipped armor with AC bonus
- **items**: Equipment array with name, description, quantity, value
- **currency**: Money (MKS - Mad King Shillings)
- **backstory**: Character background story (max 5000 chars)

### Class Model  
Classes define the core progression system:
- **name**: Class name (unique, required)
- **description**: Class description
- **hpBonusPerLevel**: HP gained per level (Warrior: 10, Rogue: 6, Wizard: 4)
- **manaBonusPerLevel**: Mana gained per level (Warrior: 2, Rogue: 4, Wizard: 8)
- **abilities**: Array of class abilities gained on odd levels (1,3,5,7,9)
- **subclasses**: Array of available subclasses with even-level abilities (2,4,6,8,10)

### Available Classes

#### Warrior (Tank/DPS)
- **HP**: +10 per level | **Mana**: +2 per level
- **Abilities**: Battle Hardened (L1), Vigorous Health (L3), Double Attack (L5), Unstoppable (L7), Weapon Mastery (L9)
- **Subclass**: Berserker - Frenzy, Wild Weaponry, Bloodlust, Savage Resilience, Avatar of Rage

#### Rogue (DPS/Utility) 
- **HP**: +6 per level | **Mana**: +4 per level
- **Abilities**: Critical Strike (L1), Quick Reflexes (L3), Evasion (L5), Gone (L7), Master Thief (L9)
- **Subclass**: Trickster - Magic Trick, Ghostly Fingers, Arcane Trickster, Greater Invisibility, God of Mischief

#### Wizard (Magic DPS/Support)
- **HP**: +4 per level | **Mana**: +8 per level  
- **Abilities**: Student of Magic (L1), Apprentice Caster (L3), Experient Caster (L5), Spell Mastery (L7), Archmage (L9)
- **Subclass**: Necromancer - Superior Raise Dead, Life Drain, Death Weaver, Death Magic, Lich Transformation

### Skills System
20 skills organized by ability scores:

**Strength**: heavyWeapons, muscle, athletics, endurance
**Dexterity**: lightWeapons, rangedWeapons, stealth, acrobatics, legerdemain  
**Charisma**: negotiation, deception, intimidation, seduction
**Intelligence**: arcana, lore, investigation, nature, insight

The API automatically calculates:
- Stat modifiers: `Math.floor((stat - 10) / 2)`
- Skill modifiers: stat modifier + proficiency bonus (2 if proficient)
- Total AC: base AC + armor bonus + class bonuses
- Combined abilities from race, class, subclass, and origin
- All skills from class, subclass, origin, and extra skills
- HP/Mana totals based on class bonuses and level

## Development Notes

- **Database**: MongoDB with Mongoose ODM for data persistence
- **Class System**: Separate Class model allows for easy management of class definitions
- **Level Progression**: Abilities are automatically granted based on character level
- **Validation**: Comprehensive input validation with Mongoose schemas
- **Virtual Fields**: Computed properties for modifiers, combined skills, and ability lists
- **Skill System**: 20+ skills with proficiency tracking and automatic modifier calculation
- **Error Handling**: Robust error handling for all endpoints with consistent JSON responses

## Database Collections

### Characters Collection
Stores individual character data with references to class definitions.

### Classes Collection  
Stores class templates with abilities, bonuses, and subclass definitions.

## Project Structure

```
madking-back/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Character.js         # Character schema with skills & abilities
│   └── Class.js            # Class schema with level-based progression  
├── sample-classes.js        # Sample class data for seeding
├── sample-character.json    # Example character data
├── server.js               # Express server with API routes
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Example Usage with curl

Seed classes (run once):
```bash
curl -X POST http://localhost:3000/seed-classes
```

Create a character:
```bash
curl -X POST http://localhost:3000/characters \
  -H "Content-Type: application/json" \
  -d @sample-character.json
```

Get all classes:
```bash
curl http://localhost:3000/classes
```

Get character with abilities at current level:
```bash
curl http://localhost:3000/characters/[character-id]
```

Level up a character:
```bash
curl -X PUT http://localhost:3000/characters/[character-id] \
  -H "Content-Type: application/json" \
  -d '{"level": 3}'
```

## Advanced Features

### Character Methods
- `getStatModifier(statValue)` - Calculate ability modifier
- `hasSkillProficiency(skillName)` - Check skill proficiency
- `rollSkillCheck(skillName)` - Roll d20 + modifiers for skill
- `getTotalAC()` - Calculate total armor class

### Class Methods  
- `getHpBonusAtLevel(level)` - Get HP bonus for specified level
- `getManaBonusAtLevel(level)` - Get mana bonus for specified level
- `getAllAbilitiesAtLevel(subclass, level)` - Get all available abilities
- `hasSubclass(name)` - Check if subclass exists

### Virtual Fields
Characters automatically calculate:
- `statModifiers` - All ability score modifiers
- `allSkills` - Combined skills from all sources  
- `allAbilities` - Combined abilities with source tracking
- `proficientSkills` - List of skills with proficiency
- `skillsByStats` - Skills organized by governing ability 
