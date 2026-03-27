<p align="center">
  <img src="https://github.com/sc-localization/lingvo-injector-app/blob/main/docs/assets/icon.png" width="50px" alt="Lingvo Injector">
</p>

# Lingvo Injector App

Star Citizen® Localization Installer - a Tauri v2 desktop application for installing and managing game translations.

<p align="center">
      <img src="https://github.com/sc-localization/.github/blob/main/assets/community.png?raw=true" width="100" alt="Made the community">
</p>

<p align="center"><em>This is an unofficial Star Citizen fansite and fan localization tool. It is, not affiliated with the Cloud Imperium group of companies. All content on this site not authored by its host or users are property of their respective owners.</em></p>

## Features

- Multi-language support with dynamic language discovery from server
- Support for all Star Citizen® versions (LIVE, PTU, HOTFIX)
- Auto-detection of game installation folder
- One-click localization installation and removal
- Per-language translation versioning and update tracking
- Active game language display with mismatch warnings
- App self-update via Tauri updater
- i18n UI (English, Russian)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Rust toolchain (for Tauri)
- Windows OS (target platform)

### Development

Run from the **repository root** (the Express server must be running):

```bash
# Start server + app concurrently (recommended)
npm run dev

# Or start only the app (if server is already running)
npm run dev:app
```

> [!NOTE]
> The app requires a running translation server. See **[Server README](../server/README.md)** for server setup, Docker configuration, and production deployment instructions.

From the `app/` directory:

```bash
npm run lint        # ESLint
npm run lint:fix    # ESLint with auto-fix
npm run format      # Prettier
```

### Building

```bash
# Development build (unsigned, from app/)
npm run tauri:build:dev

# Production build (from repo root)
npm run build:app
```

## Project Structure

```
src/
├── api/               # Server API calls (translation downloads)
├── assets/            # Static assets (community logo, etc.)
├── components/        # React components (each with .tsx + .module.scss)
│   ├── BackgroundEffects/
│   ├── Button/
│   ├── Card/
│   ├── DataMatrix/
│   ├── Footer/
│   ├── Grid/
│   ├── Panel/
│   ├── Select/
│   ├── Stack/
│   ├── Terminal/
│   ├── Titlebar/
│   └── Typography/
├── constants/         # Language ID -> game code mappings
├── fonts/             # Custom fonts (ShareTechMono)
├── hooks/             # Action hooks
│   ├── useSettingsActions.ts          # Install/uninstall/folder selection
│   ├── useUpdateActions.ts            # App self-update
│   └── useTranslationUpdateActions.ts # Translation update logic
├── locales/           # i18n translations (en.json, ru.json)
├── services/          # Tauri IPC wrappers
│   ├── localizationService.ts  # Game localization operations
│   ├── settingsService.ts      # Settings management
│   └── updateService.ts        # App self-update
├── stores/            # MobX state management
│   ├── RootStore.ts
│   ├── SettingsStore.ts
│   └── UIStore.ts
├── styles/            # SCSS styles
│   ├── index.scss
│   ├── _variables.scss
│   ├── _animations.scss
│   ├── _functions.scss
│   ├── _mixins.scss
│   └── _reset.scss
├── types/             # TypeScript type definitions
├── i18n.ts            # i18next configuration
└── App.tsx            # Main application component

src-tauri/
└── src/
    └── lib.rs         # Rust backend (Tauri IPC commands)
```

## How It Works

### Language ID vs Game Code

The app uses a two-tier system for language handling:

1. **Language ID** (server paths and internal logic): `ru`, `ko`, `en`, `zh`, etc.
2. **Game Code** (Star Citizen installation): `korean_(south_korea)`, `english`, `chinese_(simplified)`, etc.

### Russian/Korean Conflict

> [!IMPORTANT]
> Both Russian and Korean translations install to the same folder (`korean_(south_korea)`) in Star Citizen because:
>
> - Star Citizen doesn't natively support Cyrillic
> - Korean locale supports non-Latin characters including Cyrillic
> - This is a workaround to display Russian text in the game

**Result**: Only ONE can be active at a time. Installing one overwrites the other.

### Installation Flow

1. User selects translation language and game version
2. Click "Install Localization":
   - Rust backend creates `data/Localization/{game_code}/` folder
   - Rust backend writes `g_language` to `user.cfg`
   - App downloads `global.ini` from Express server using language ID
   - Rust backend writes translation file to the localization folder
   - Installed translation version is recorded in `config.json`
3. Click "Remove Localization":
   - Deletes localization folder
   - Removes `g_language` from `user.cfg`

## Configuration

### Environment Variables

Create a `.env` file in `app/`:

```env
VITE_SERVER_URL=http://localhost:3001
```

For production, point this to the deployed server URL.

### Config File

User settings are stored in `config.json` next to the executable. Includes:

- `base_folder` - Star Citizen® installation path
- `selected_version` - Active game version (LIVE/PTU/HOTFIX)
- `selected_language` - Selected translation language ID
- `installed_translations` - Per-version/language installed translation versions

## Development Notes

- Use `observer()` HOC for reactive MobX components
- Access stores via `useStores()` hook
- Translation keys resolved with `t()` from react-i18next
- Game versions are uppercase (`LIVE`, `PTU`, `HOTFIX`)
- All filesystem operations go through Rust IPC (no `@tauri-apps/plugin-fs`)
- Components use SCSS modules (`*.module.scss`)

## Tech Stack

- **Frontend**: React 19, TypeScript, MobX, Vite, i18next, Sass
- **Backend**: Rust, Tauri v2

## Related Projects

- [Lingvo Injector Server](../server/) - Translation files server

## License

See [LICENSE](../LICENSE) file for details.

## Trademarks

Star Citizen®, Roberts SpaceIndustries® and Cloud Imperium® are registered trademarks of Cloud Imperium Rights LLC.
