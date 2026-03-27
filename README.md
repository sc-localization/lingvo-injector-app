<p align="center">
  <img src="https://github.com/sc-localization/lingvo-injector-app/blob/main/docs/assets/app-header.png" width="100%" alt="Lingvo Injector">
</p>

---

<!-- <h1 align="center">Lingvo Injector</h1> -->

<p align="center">Desktop app for installing translation files.</p>

<p align="center">
      <img src="https://github.com/sc-localization/.github/blob/main/assets/community.png?raw=true" width="100" alt="Made the community">
</p>

<p align="center"><em>This is an unofficial Star Citizen fansite and fan localization tool. It is, not affiliated with the Cloud Imperium group of companies. All content on this site not authored by its host or users are property of their respective owners.</em></p>

## Quick Start

```bash
git clone https://github.com/sc-localization/lingvo-injector.git
cd lingvo-injector
npm install
npm run dev          # Start server + app concurrently
```

> [!NOTE]
> Each component has its own README with detailed setup, build, and deployment instructions:
>
> - **[App README](app/README.md)** — Tauri desktop app: development, building, project structure
> - **[Server README](server/README.md)** — Translation server: API endpoints, Docker setup (local & production), VPS deployment

## Project Structure

```
lingvo-injector/
├── app/                        # Tauri v2 desktop app
│   ├── src/                    # React frontend
│   │   ├── api/                # Server API calls
│   │   ├── assets/             # Static assets (images)
│   │   ├── components/         # UI components
│   │   │   ├── BackgroundEffects/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── DataMatrix/
│   │   │   ├── Footer/
│   │   │   ├── Grid/
│   │   │   ├── Panel/
│   │   │   ├── Select/
│   │   │   ├── Stack/
│   │   │   ├── Terminal/
│   │   │   ├── Titlebar/
│   │   │   └── Typography/
│   │   ├── constants/          # Language mappings
│   │   ├── fonts/              # Custom fonts
│   │   ├── hooks/              # React hooks (actions)
│   │   ├── locales/            # UI translations (en, ru)
│   │   ├── services/           # Tauri IPC wrappers
│   │   ├── stores/             # MobX state management
│   │   ├── styles/             # SCSS styles (variables, mixins, animations)
│   │   └── types/              # TypeScript types
│   └── src-tauri/              # Rust backend
│
├── server/                     # Translation server
│   ├── server.js               # Express server
│   ├── Dockerfile              # Container image
│   ├── docker-compose.yml      # Docker Compose (local testing)
│   ├── docker-compose.prod.yml # Docker Compose (production + nginx)
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

| Language             | Server Path | Game Code              |
| -------------------- | ----------- | ---------------------- |
| English              | `en/`       | `english`              |
| Russian              | `ru/`       | `korean_(south_korea)` |
| Korean               | `ko/`       | `korean_(south_korea)` |
| Chinese (Simplified) | `zh/`       | `chinese_(simplified)` |
| French               | `fr/`       | `french_(france)`      |
| German               | `de/`       | `german_(germany)`     |
| Italian              | `it/`       | `italian_(italy)`      |
| Japanese             | `ja/`       | `japanese_(japan)`     |
| Polish               | `pl/`       | `polish_(poland)`      |
| Portuguese           | `pt/`       | `portuguese_(brazil)`  |
| Spanish              | `es/`       | `spanish_(spain)`      |

> [!IMPORTANT]
> Russian and Korean share the same game code (`korean_(south_korea)`). Only one can be active at a time.

## Tech Stack

**App:** Tauri v2 (Rust), React 19, TypeScript, MobX, i18next, Sass

**Server:** Node.js 22, Express 5, Docker, nginx

## License

CC BY-NC 4.0 - See [LICENSE](LICENSE) for details.

## Trademarks

Star Citizen®, Roberts SpaceIndustries® and Cloud Imperium® are registered trademarks of Cloud Imperium Rights LLC.
