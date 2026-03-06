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
UI_MainMenu=Главное меню
UI_Settings=Настройки
UI_Exit=Выход

# Gameplay
Game_Welcome=Добро пожаловать, гражданин!
```

## Production Deployment (Docker)

### Prerequisites

- Docker and Docker Compose installed on your VPS

### Setup

1. Clone the repo and navigate to the server directory:

```bash
cd server
```

2. Create a `.env` file (optional, for custom base URL):

```bash
# Set this to your domain's translations URL
BASE_URL=https://your-domain.com/translations
```

If `BASE_URL` is not set, the server derives it from the incoming request's `Host` header.

3. Start the services:

```bash
docker compose up -d --build
```

4. Verify:

```bash
curl http://localhost/versions/versions.json
curl http://localhost/translations/LIVE/ru/global.ini
```

### SSL with Certbot

1. Update `nginx/nginx.conf`: replace `your-domain.com` with your actual domain in the commented-out HTTPS block.

2. Obtain certificates:

```bash
docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d your-domain.com
```

Or install certbot on the host and use it directly.

3. Uncomment the HTTPS server block in `nginx/nginx.conf` and remove/comment the default HTTP block (keep the ACME challenge location and HTTP-to-HTTPS redirect).

4. Restart nginx:

```bash
docker compose restart nginx
```

5. Update the app's API base URL to point to your production server (e.g., `https://your-domain.com`).

### Updating Translations

Translation files are mounted as volumes from `./translations` and `./versions`. Update files on disk and they are served immediately — no container restart needed.

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
