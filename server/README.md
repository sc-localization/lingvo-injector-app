# Lingvo Injector Server

HTTP server for serving Star Citizen translation files and application updates.

## Features

- 🌐 Serves translation files for all game versions (LIVE, PTU, HOTFIX)
- 📦 Hosts application updates with metadata
- 🔄 CORS-enabled for desktop application access
- 📁 Static file serving with Express.js

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Running

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix
```

## Server Structure

```
lingvo-injector-server/
├── server.js          # Main Express server
├── translations/      # Translation files organized by language ID
│   ├── LIVE/
│   │   ├── ru/global.ini     # Russian
│   │   ├── ko/global.ini     # Korean
│   │   ├── en/global.ini     # English
│   │   └── ...
│   ├── PTU/
│   └── HOTFIX/
├── versions/
│   └── versions.json  # Translation version metadata
└── updates/
    └── app/
        ├── latest.json              # Update metadata
        └── lingvo-injector-app.exe  # Application installer
```

## API Endpoints

### Translation Files

**GET** `/translations/:branch/:language_id/global.ini`

Serves translation files for specific game branch and language.

**Examples:**
- `/translations/LIVE/ru/global.ini` - Russian translation for LIVE
- `/translations/PTU/ko/global.ini` - Korean translation for PTU
- `/translations/HOTFIX/en/global.ini` - English translation for HOTFIX

### Version Metadata

**GET** `/versions/versions.json`

Returns translation version information with dynamically injected base URL.

**Response:**
```json
{
  "baseUrl": "http://localhost:3001/translations",
  "LIVE": {
    "version": "1.5.0",
    "filename": "live_ru_1.5.0.zip",
    "notes": "Main update for LIVE"
  },
  "PTU": { ... },
  "HOTFIX": { ... }
}
```

### Application Updates

**GET** `/updates/app/latest.json`

Returns application update metadata with platform-specific download URLs.

**Response:**
```json
{
  "version": "0.0.2",
  "notes": "New features and bug fixes",
  "pub_date": "2025-10-26T09:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "url": "http://localhost:3001/updates/app/lingvo-injector-app.exe",
      "signature": "your-signature-here",
      "version": "0.0.2"
    }
  }
}
```

**GET** `/updates/app/:file`

Serves application update files.

## Translation File Structure

### Language IDs vs Game Codes

**Server uses Language IDs** for organization:
- `ru` - Russian
- `ko` - Korean
- `en` - English
- `zh` - Chinese (Simplified)
- `fr` - French
- `de` - German
- `it` - Italian
- `ja` - Japanese
- `pl` - Polish
- `pt` - Portuguese
- `es` - Spanish

**Client uses Game Codes** for installation in Star Citizen:
- `korean_(south_korea)` - Both Russian AND Korean (conflict!)
- `english` - English
- `chinese_(simplified)` - Chinese
- `french_(france)` - French
- etc.

### Russian/Korean Conflict

> [!IMPORTANT]  
> Russian and Korean both install to `korean_(south_korea)` folder in the game:

**On Server** (separate):
```
translations/LIVE/ru/global.ini    # Russian translation
translations/LIVE/ko/global.ini    # Korean translation
```

**In Game** (same folder):
```
StarCitizen/LIVE/data/Localization/korean_(south_korea)/global.ini
```

Only ONE can be active at a time. This is a Star Citizen limitation.

## Adding New Translations

1. Create language folder using **language ID**:
```bash
mkdir -p translations/LIVE/{language_id}
mkdir -p translations/PTU/{language_id}
mkdir -p translations/HOTFIX/{language_id}
```

2. Create `global.ini` file in each folder:
```ini
# Star Citizen Translation - {Language}

Key=Translated text
AnotherKey=Another translation
```

3. Test by accessing:
```
http://localhost:3001/translations/LIVE/{language_id}/global.ini
```

### Example: Adding French Translation

```bash
# Create directories
mkdir -p translations/LIVE/fr
mkdir -p translations/PTU/fr
mkdir -p translations/HOTFIX/fr

# Create translation file
cat > translations/LIVE/fr/global.ini << 'EOF'
# Star Citizen French Translation - LIVE

Test_Welcome=Bienvenue dans Star Citizen
Test_MainMenu=Menu Principal
Test_Settings=Paramètres
Test_Exit=Quitter
EOF

# Copy to other versions
cp translations/LIVE/fr/global.ini translations/PTU/fr/
cp translations/LIVE/fr/global.ini translations/HOTFIX/fr/

# Test
curl http://localhost:3001/translations/LIVE/fr/global.ini
```

## Configuration

### Port

Default port is `3001`. Change in `server.js`:
```javascript
const port = 3001; // Change this
```

### Base URLs

Server dynamically injects base URLs into responses:
- `TRANSLATIONS_BASE_URL`: `http://localhost:{port}/translations`
- `UPDATES_BASE_URL`: `http://localhost:{port}/updates/app`

## File Format

Translation files use INI format:

```ini
# Comments start with #

# UI Elements
UI_MainMenu=Главное меню
UI_Settings=Настройки
UI_Exit=Выход

# Gameplay
Game_Welcome=Добро пожаловать, гражданин!
```

## Production Deployment

1. Update `server.js` with production URLs
2. Replace `your-signature-here` in latest.json with actual Tauri signature
3. Place application installer in `updates/app/`
4. Consider using nginx/Apache as reverse proxy
5. Enable HTTPS for security

## Security Notes

- Server has CORS enabled for all origins (development setup)
- For production, restrict CORS to specific origins
- Implement rate limiting for public deployments
- Use HTTPS for production

## Tech Stack

- Node.js
- Express.js 5.x
- CORS middleware

## Related Projects

- [Lingvo Injector App](../lingvo-injector-app/) - Desktop client application

## Support

For translation contributions, see the [translations README](translations/README.md).
