# Lingvo Injector App

Star Citizen Localization Installer - a Tauri v2 desktop application for installing and managing game translations.

## Features

- 🌍 Multi-language support (Russian, Korean, English, Chinese, and more)
- 🎮 Support for all Star Citizen versions (LIVE, PTU, HOTFIX)
- 🔄 Auto-detection of game installation folder
- 📦 One-click localization installation and removal
- 🖥️ Native Windows desktop application

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Rust (for Tauri development)
- Windows OS (target platform)

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run tauri dev

# Run linter
npm run lint

# Format code
npm run format
```

### Building

```bash
# Development build (unsigned)
npm run tauri:build:dev

# Production build (with signing)
npm run tauri:build:release
```

## Project Structure

```
src/
├── api/               # API layer (translation downloads)
├── components/        # React components
│   ├── Button/       # Button component
│   ├── Select/       # Select dropdown component
│   └── MessageDisplay/ # Message/notification component
├── constants/         # App constants (languages, etc.)
├── hooks/            # Custom React hooks
├── locales/          # i18n translations (en, ru)
├── services/         # Business logic services
│   ├── localizationService.ts  # Game localization operations
│   └── settingsService.ts      # Settings management
├── stores/           # MobX state management
│   ├── RootStore.ts
│   ├── SettingsStore.ts
│   └── UIStore.ts
├── types/            # TypeScript type definitions
└── App.tsx           # Main application component

src-tauri/
└── src/
    └── lib.rs        # Rust backend (Tauri commands)
```

## How It Works

### Language ID vs Game Code

The app uses a two-tier system for language handling:

1. **Language ID** (used for server paths and internal logic):
   - `ru` - Russian
   - `ko` - Korean
   - `en` - English
   - `zh` - Chinese
   - etc.

2. **Game Code** (used for installation in Star Citizen):
   - `korean_(south_korea)` - Used for both Russian and Korean
   - `english` - English
   - `chinese_(simplified)` - Chinese
   - etc.

### Russian/Korean Conflict

> [!IMPORTANT]  
> Both Russian and Korean translations install to the same folder (`korean_(south_korea)`) in Star Citizen because:
> - Star Citizen doesn't natively support Cyrillic
> - Korean locale supports non-Latin characters including Cyrillic
> - This is a workaround to display Russian text in the game

**Result**: Only ONE can be active at a time. Installing one overwrites the other.

### Installation Flow

1. User selects translation language and game version
2. Click "Install Localization":
   - App creates `data/Localization/{game_code}/` folder
   - Downloads `global.ini` from server using language ID
   - Writes translation file to the folder
   - Updates `user.cfg` with `g_language` parameter
3. Click "Remove Localization":
   - Deletes localization folder
   - Removes `g_language` from `user.cfg`

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SERVER_URL=http://localhost:3001
```

### Config File Location

User settings are stored in `config.json` next to the executable (not in AppData).

## Development Notes

- Use `observer()` HOC for reactive MobX components
- Access stores via `useStores()` hook
- Translation keys resolved with `t()` from react-i18next
- Game versions are uppercase (`LIVE`, `PTU`, `HOTFIX`)

## Tech Stack

- **Frontend**: React 19, TypeScript, MobX, Vite
- **Backend**: Rust, Tauri v2
- **i18n**: react-i18next
- **Styling**: (to be added)

## License

See LICENSE file for details.

## Related Projects

- [Lingvo Injector Server](../lingvo-injector-server/) - Translation files server
