<p align="center">
  <img src="https://github.com/sc-localization/lingvo-injector/blob/main/docs/assets/icon.png?raw=true" width="100" alt="Lingvo Injector">
</p>

<h1 align="center">Lingvo Injector</h1>

<p align="center">Star Citizen localization manager - desktop app for installing translation files.</p>

<p align="center">
      <img src="https://github.com/sc-localization/.github/blob/main/assets/community.png?raw=true" width="100" alt="Made the community">
</p>

<p align="center"><em>This is an unofficial Star Citizen fansite, not affiliated with the Cloud Imperium group of companies. All content on this site not authored by its host or users are property of their respective owners.</em></p>

## Quick Start

### Prerequisites

- Node.js 18+
- Rust toolchain (for Tauri)
- Windows OS (target platform)

### Installation

```bash
git clone https://github.com/sc-localization/lingvo-injector.git
cd lingvo-injector
npm install
```

### Development

```bash
# Run server + app concurrently (recommended)
npm run dev

# Or run separately
npm run dev:server   # Express server (port 3001)
npm run dev:app      # Tauri app (Vite :1420 + Tauri)
```

The Express server must be running before the app, as the app fetches translation data from it.

### Building

```bash
npm run build:app    # Production Tauri release build
```

### Linting & Formatting

```bash
npm run lint         # ESLint on both workspaces
npm run format       # Prettier on both workspaces
```

Pre-commit hooks (Husky + lint-staged) auto-fix and format staged files. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).

## Project Structure

```
lingvo-injector/
├── app/                        # Tauri v2 desktop app
│   ├── src/                    # React frontend
│   │   ├── api/                # Server API calls
│   │   ├── components/         # UI components
│   │   ├── hooks/              # React hooks (actions)
│   │   ├── stores/             # MobX state management
│   │   ├── services/           # Tauri IPC wrappers
│   │   ├── constants/          # Language mappings
│   │   ├── locales/            # UI translations (en, ru)
│   │   └── types/              # TypeScript types
│   └── src-tauri/              # Rust backend
│
├── server/                     # Translation server
│   ├── server.js               # Express server
│   ├── Dockerfile              # Container image
│   ├── docker-compose.yml      # Docker Compose (app + nginx)
│   ├── nginx/                  # Reverse proxy config
│   ├── translations/           # Translation files by version/language
│   │   ├── LIVE/
│   │   ├── PTU/
│   │   └── HOTFIX/
│   └── versions/               # Version metadata
│
└── package.json                # npm workspaces root
```

## Features

- Auto-detection of Star Citizen installation folder
- Support for all game versions (LIVE, PTU, HOTFIX)
- Dynamic translation discovery (server scans filesystem for available languages)
- Per-language translation versioning and update tracking
- Active game language display with mismatch warnings
- One-click install/uninstall of translations
- App self-update via Tauri updater
- i18n UI (English, Russian)

## Available Translations

Languages are discovered dynamically from the server filesystem. Add new translations by placing `global.ini` files in `server/translations/{VERSION}/{LANG}/`.

## Language Mapping

Star Citizen uses specific locale codes. Russian uses `korean_(south_korea)` because SC doesn't support Cyrillic natively.

| Language | Server Path | Game Code              |
| -------- | ----------- | ---------------------- |
| English  | `en/`       | `english`              |
| Russian  | `ru/`       | `korean_(south_korea)` |

## Server Deployment

The server can run locally for development or be deployed to a VPS using Docker + nginx. See [server/README.md](server/README.md) for deployment instructions.

## Tech Stack

**App:** Tauri v2 (Rust), React 19, TypeScript, MobX, i18next

**Server:** Node.js, Express 5, Docker, nginx

## Troubleshooting

**App can't download translations:**

- Make sure server is running (`npm run dev:server`)
- Check that `http://localhost:3001/versions/versions.json` returns valid JSON

**Workspace issues:**

```bash
npm install  # Reinstall all dependencies
```

**Tauri build issues:**

```bash
cd app
cargo clean
npm run build
```

## License

CC BY-NC 4.0 - See [LICENSE](LICENSE) for details.
