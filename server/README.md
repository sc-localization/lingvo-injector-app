<p align="center">
  <img src="https://github.com/sc-localization/lingvo-injector-app/blob/main/docs/assets/icon.png" width="50px" alt="Lingvo Injector">
</p>

# Lingvo Injector Server

HTTP server for serving Star Citizen® translation files and version metadata.

<p align="center">
      <img src="https://github.com/sc-localization/.github/blob/main/assets/community.png?raw=true" width="100" alt="Made the community">
</p>

<p align="center"><em>This is an unofficial Star Citizen fansite and fan localization tool. It is, not affiliated with the Cloud Imperium group of companies. All content on this site not authored by its host or users are property of their respective owners.</em></p>

## Features

- Serves translation files for all game versions (LIVE, PTU, HOTFIX)
- Dynamic language discovery per game version (scans filesystem)
- Configurable base URL for production deployment
- CORS-enabled for desktop application access
- Docker + nginx deployment ready

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
server/
├── server.js               # Main Express server
├── Dockerfile              # Container image (Node 22-Alpine)
├── docker-compose.yml      # Docker Compose (app + nginx)
├── nginx/
│   └── nginx.conf          # Reverse proxy config
├── translations/           # Translation files by version/language
│   ├── LIVE/
│   │   ├── ru/global.ini
│   │   ├── de/global.ini
│   │   └── ...
│   ├── PTU/
│   └── HOTFIX/
└── versions/
    └── versions.json       # Translation version metadata
```

## API Endpoints

### Translation Files

**GET** `/translations/:branch/:language_id/global.ini`

Serves translation files for specific game branch and language.

**Examples:**

- `/translations/LIVE/ru/global.ini` - Russian translation for LIVE
- `/translations/PTU/fr/global.ini` - French translation for PTU
- `/translations/HOTFIX/es/global.ini` - Spanish translation for HOTFIX

### Version Metadata

**GET** `/versions/versions.json`

Returns translation version information with dynamically injected base URL and available languages per game version.

**Response:**

```json
{
  "baseUrl": "http://localhost:3001/translations",
  "LIVE": {
    "languages": {
      "ru": { "version": "1.5.0" },
      "de": { "version": "1.6.0" }
    }
  },
  "PTU": {
    "languages": {
      "ru": { "version": "1.5.1" },
      "fr": { "version": "1.0.1" }
    }
  },
  "HOTFIX": {
    "languages": {
      "ru": { "version": "1.5.2" },
      "es": { "version": "1.7.2" }
    }
  }
}
```

Available languages are dynamically discovered by scanning the `translations/` directory.

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

3. Add version entry in `versions/versions.json` for each game version:

```json
{
  "LIVE": {
    "languages": {
      "your_lang_id": { "version": "1.0.0" }
    }
  }
}
```

4. Test by accessing:

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

### Environment Variables

| Variable   | Default                  | Description                                                  |
| ---------- | ------------------------ | ------------------------------------------------------------ |
| `PORT`     | `3001`                   | Server listen port                                           |
| `BASE_URL` | _(derived from request)_ | Translations base URL injected into `versions.json` response |

## File Format

Translation files use INI format:

```ini
# Comments start with #

# UI Elements
UI_MainMenu=Main Menu
UI_Settings=Settings
UI_Exit=Exit

# Gameplay
Game_Welcome=Welcome, citizen!
```

## Tech Stack

- Node.js 22
- Express.js 5
- Docker + nginx

## Related Projects

- [Lingvo Injector App](../app/) - Desktop client application

## License

See [LICENSE](../LICENSE) file for details.

## Trademarks

Star Citizen®, Roberts SpaceIndustries® and Cloud Imperium® are registered trademarks of Cloud Imperium Rights LLC.
