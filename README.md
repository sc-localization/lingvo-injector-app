<p align="center">
  <img src="https://github.com/sc-localization/lingvo-injector-app/blob/main/docs/assets/icon.png?raw=true" width="100" alt="Lingvo Injector">
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
git clone https://github.com/sc-localization/lingvo-injector-app.git
cd lingvo-injector
npm install
```

### Development

**Important:** Start server BEFORE the app!

```bash
# Option 1: Run both (recommended)
npm run dev

# Option 2: Run separately
# Terminal 1 - Start server first
npm run dev:server
# Terminal 2 - Then start app
npm run dev:app
```

Server runs on `http://localhost:3001`

### Building

```bash
npm run build:app
```

## Project Structure

```
lingvo-injector/
├── app/                    # Tauri + React desktop app
│   ├── src/               # React frontend
│   │   ├── stores/        # MobX state management
│   │   ├── services/      # Tauri API wrappers
│   │   ├── hooks/         # React hooks
│   │   ├── constants/     # Language mappings
│   │   └── locales/       # UI translations (en, ru)
│   └── src-tauri/         # Rust backend
│
├── server/                 # Translation server
│   ├── server.js          # Express server
│   ├── translations/      # Translation files
│   │   ├── LIVE/
│   │   │   ├── en/       # English
│   │   │   └── ru/       # Russian
│   │   ├── PTU/
│   │   └── HOTFIX/
│   └── versions/          # Version metadata
│
└── package.json           # Workspaces root
```

## Available Translations

Currently available:
- **English** (en)
- **Russian** (ru)

More languages can be added by placing `global.ini` files in `server/translations/{VERSION}/{LANG}/`.

## Language Mapping

Star Citizen uses specific locale codes. Russian uses `korean_(south_korea)` because SC doesn't support Cyrillic natively.

| Language | Server Path | Game Code |
|----------|-------------|-----------|
| English  | `en/`       | `english` |
| Russian  | `ru/`       | `korean_(south_korea)` |

## Tech Stack

**App:**
- Tauri v2 (Rust)
- React 19
- TypeScript
- MobX

**Server:**
- Node.js
- Express.js

## Troubleshooting

**App can't download translations:**
- Make sure server is running (`npm run dev:server`)
- Check that `http://localhost:3001/translations/LIVE/ru/global.ini` is accessible

**Workspace issues:**
```bash
npm install  # Reinstall dependencies
```

**Tauri build issues:**
```bash
cd app
cargo clean
npm run build
```

## License

CC BY-NC 4.0 - See [LICENSE](LICENSE) for details.
