# Mad King RPG Character Sheet API

A simple Node.js backend API for managing RPG character sheets.

## Installation

1. Install Node.js if you haven't already
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
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

## API Endpoints

### Base URL: `http://localhost:3000`

### GET /
Returns API information and available endpoints.

### GET /characters
Get all characters.

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

### GET /characters/:id
Get a specific character by ID.

### POST /characters
Create a new character.

**Request body example:**
```json
{
  "name": "Lyra Thornfield",
  "race": {
    "name": "Human",
    "ability": "Adaptable: reroll once/day"
  },
  "class": {
    "name": "Warrior",
    "bonuses": [
      {"type": "STR", "value": 2},
      {"type": "AC", "value": 2}
    ],
    "skills": ["Athletics", "Intimidation"]
  },
  "subclass": {
    "name": "Dark Knight",
    "bonuses": [{"type": "STR", "value": 1}],
    "abilities": ["Shadow Strike: 8 damage, costs 4 HP"]
  },
  "origin": {
    "name": "Farmer",
    "bonuses": [{"type": "STR", "value": 1}],
    "skills": ["Animal Handling"]
  },
  "extraSkills": ["Stealth", "Occultism"],
  "stats": {
    "str": 15,
    "dex": 12,
    "int": 10
  },
  "hp": 12,
  "maxHp": 12,
  "ac": 12,
  "mana": null,
  "armor": {
    "name": "Leather armor",
    "acBonus": 2
  },
  "items": [
    {
      "name": "Greatsword",
      "requirements": "STR 12",
      "damage": 10
    }
  ],
  "currency": 3,
  "backstory": "A farmer turned warrior after the Mad King's curse claimed her village, now delving for sigils to buy a cure."
}
```

### PUT /characters/:id
Update an existing character by ID.

### DELETE /characters/:id
Delete a character by ID.

## Character Data Model

Characters include the following properties:
- **name**: Character name
- **race**: Race info with name and special ability
- **class**: Class with bonuses and skills
- **subclass**: Subclass with additional bonuses and abilities  
- **origin**: Character background with bonuses and skills
- **extraSkills**: Additional skills beyond class/origin
- **stats**: STR, DEX, INT values
- **hp/maxHp**: Hit points
- **ac**: Armor class
- **mana**: Mana points (null if not used)
- **armor**: Equipped armor with AC bonus
- **items**: Equipment list
- **currency**: Money (MKS - Mad King Shillings)
- **backstory**: Character background story

The API automatically calculates:
- Stat modifiers
- Total AC (base + armor + class bonuses)
- Combined skills from all sources
- Creation/update timestamps

## Development Notes

- Characters are currently stored in memory (data is lost when server restarts)
- For production, replace in-memory storage with a database (MongoDB, PostgreSQL, etc.)
- All endpoints return consistent JSON responses with `success` field
- Input validation is performed on character creation and updates
- Error handling is implemented for common scenarios

## Example Usage with curl

Create a character:
```bash
curl -X POST http://localhost:3000/characters \
  -H "Content-Type: application/json" \
  -d @sample-character.json
```

Get all characters:
```bash
curl http://localhost:3000/characters
```

Update a character:
```bash
curl -X PUT http://localhost:3000/characters/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'
```

Delete a character:
```bash
curl -X DELETE http://localhost:3000/characters/1
```"# madkingsystem" 
