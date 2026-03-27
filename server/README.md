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
├── docker-compose.yml      # Docker Compose for local testing (app only)
├── docker-compose.prod.yml # Docker Compose for production (app + nginx)
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

## Docker

### Local Testing

Uses `docker-compose.yml` — runs only the app container with port 3001 exposed directly (no nginx).

1. Navigate to the server folder:

```bash
cd server
```

2. Build and start:

```bash
docker compose up --build
```

3. Verify the server is running:

```bash
curl http://localhost:3001/versions/versions.json
curl http://localhost:3001/health
```

4. Stop:

```bash
docker compose down
```

> [!TIP]
> `translations/` and `versions/` are mounted as volumes — you can update translation files without rebuilding the image.

---

### Deploy to VPS (pre-built image from local machine)

Build the Docker image locally and upload it to the server — no need to clone the repo on the VPS.

#### 1. Build the image locally

```bash
cd server
docker build -t lingvo-server .
```

#### 2. Save the image to a file

```bash
docker save lingvo-server | gzip > lingvo-server.tar.gz
```

#### 3. Upload to the server

```bash
scp lingvo-server.tar.gz root@YOUR_SERVER_IP:/opt/
```

#### 4. On the server: install Docker (if not installed)

```bash
ssh root@YOUR_SERVER_IP

# Update packages
apt update && apt upgrade -y

# Install dependencies
apt install -y ca-certificates curl gnupg

# Add Docker GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify
docker --version
docker compose version
```

#### 5. On the server: load the image

```bash
docker load < /opt/lingvo-server.tar.gz
```

#### 6. Upload configuration files (from local machine)

```bash
ssh root@YOUR_SERVER_IP "mkdir -p /opt/lingvo-server"
scp docker-compose.prod.yml root@YOUR_SERVER_IP:/opt/lingvo-server/docker-compose.yml
scp -r nginx root@YOUR_SERVER_IP:/opt/lingvo-server/
scp -r translations root@YOUR_SERVER_IP:/opt/lingvo-server/
scp -r versions root@YOUR_SERVER_IP:/opt/lingvo-server/
```

#### 7. On the server: configure docker-compose.yml

```bash
ssh root@YOUR_SERVER_IP
cd /opt/lingvo-server
```

Edit `docker-compose.yml` — replace `build: .` with `image: lingvo-server` and set your domain:

```bash
nano docker-compose.yml
```

Change the `app` service:

```yaml
image: lingvo-server # instead of build: .
environment:
  - BASE_URL=https://your-domain.com/translations
  - ALLOWED_ORIGINS=https://your-domain.com
```

#### 8. (Optional) Set up SSL with Let's Encrypt

Edit `nginx/nginx.conf` — replace `your-domain.com` with your domain in the commented-out HTTPS block.

Obtain the certificate:

```bash
# Start without SSL first so certbot can pass the challenge
docker compose up -d

# Run certbot
docker run --rm \
  -v ./certbot/conf:/etc/letsencrypt \
  -v ./certbot/www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot -w /var/www/certbot \
  -d your-domain.com \
  --email your@email.com \
  --agree-tos --no-eff-email

# Stop containers
docker compose down
```

Uncomment the HTTPS block in `nginx/nginx.conf` and replace the HTTP block with a redirect.

#### 9. Start the server

```bash
docker compose up -d
```

#### 10. Verify

```bash
# Logs
docker compose logs -f

# Health check
curl http://localhost/health

# Versions
curl http://localhost/versions/versions.json
```

#### SSL certificate auto-renewal (cron)

```bash
crontab -e
```

Add the following line:

```
0 3 * * 1 cd /opt/lingvo-server && docker run --rm -v ./certbot/conf:/etc/letsencrypt -v ./certbot/www:/var/www/certbot certbot/certbot renew && docker compose exec nginx nginx -s reload
```

#### Updating the image

Repeat steps 1–5 locally, then on the server:

```bash
cd /opt/lingvo-server
docker compose down
docker compose up -d
```

---

### Deploy to VPS (build on server)

Alternative approach — clone the repo directly on the server and build there.

#### 1. Connect to the server

```bash
ssh root@YOUR_SERVER_IP
```

#### 2. Install Docker (same as step 4 above)

#### 3. Clone only the server folder

```bash
cd /opt
git clone --depth 1 --filter=blob:none --sparse \
  https://github.com/sc-localization/lingvo-injector.git
cd lingvo-injector
git sparse-checkout set server
cd server
```

> [!TIP]
> This downloads only the `server/` folder, not the entire repository.

#### 4. Configure environment variables

Create a `.env` file in the `server/` folder:

```bash
cat > .env << 'EOF'
BASE_URL=https://your-domain.com/translations
ALLOWED_ORIGINS=https://your-domain.com
EOF
```

#### 5. Start the server

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

#### 6. Verify

```bash
docker compose -f docker-compose.prod.yml logs -f
curl http://localhost/health
curl http://localhost/versions/versions.json
```

#### Updating the server

```bash
cd /opt/lingvo-injector
git pull
cd server
docker compose -f docker-compose.prod.yml up -d --build
```

#### Useful commands

```bash
docker compose ps              # Container status
docker compose logs -f app     # App logs
docker compose logs -f nginx   # Nginx logs
docker compose restart         # Restart
docker compose down            # Stop
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
