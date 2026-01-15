# Translation Files Structure

This directory contains translation files for different Star Citizen game versions.

## Directory Structure

Translation files are organized by **language ID** (not game code):

```
translations/
├── LIVE/
│   ├── ru/              # Russian (ID-based, installs to korean_(south_korea))
│   ├── ko/              # Korean (ID-based, installs to korean_(south_korea))
│   ├── en/              # English
│   ├── zh/              # Chinese
│   └── ...
├── PTU/
│   ├── ru/
│   ├── ko/
│   └── ...
└── HOTFIX/
    ├── ru/
    ├── ko/
    └── ...
```

## Language IDs vs Game Codes

**Language IDs** (used for server paths):
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

**Game Codes** (used for installation in Star Citizen):

- `english` - English
- `french_(france)` - French
- `german_(germany)` - German
- `italian_(italy)` - Italian
- `japanese_(japan)` - Japanese
- `korean_(south_korea)` - **Russian** (workaround for Cyrillic support)
- `polish_(poland)` - Polish
- `portuguese_(brazil)` - Portuguese
- `spanish_(spain)` - Spanish
- `chinese_(simplified)` - Chinese Simplified

## Important: Russian and Korean Conflict

**Star Citizen does not natively support Cyrillic characters.**

Both Russian and Korean translations install to the **same folder** in the game (`korean_(south_korea)`) because:
- Korean locale supports non-Latin characters including Cyrillic
- This is the only way to display Russian text in the game

### How It Works

1. **On Server**: Translations stored separately by language ID
   - Russian: `translations/LIVE/ru/global.ini`
   - Korean: `translations/LIVE/ko/global.ini`

2. **In Game**: Both install to same folder
   - Russian installs to: `StarCitizen/LIVE/data/Localization/korean_(south_korea)/`
   - Korean installs to: `StarCitizen/LIVE/data/Localization/korean_(south_korea)/`

> [!IMPORTANT]
> Only ONE can be active at a time. Installing one will overwrite the other. This is a Star Citizen limitation, not an app limitation.

## Adding New Translations

1. Create a folder with the **language ID** inside the game version folder (LIVE/PTU/HOTFIX)
   - Example: `LIVE/ru/` for Russian, `LIVE/ko/` for Korean
2. Place your `global.ini` file inside that folder
3. The file should follow the INI format:
   ```ini
   Key=Translated text
   AnotherKey=Another translated text
   ```

**Example for adding French translation:**
```bash
mkdir -p LIVE/fr PTU/fr HOTFIX/fr
# Create global.ini in each folder with French translations
```

## File Format

Translation files use the INI format with key-value pairs:

```ini
# Comments start with #
UI_MainMenu=Главное меню
UI_Settings=Настройки
UI_Exit=Выход
```

## Testing

After adding translation files, you can test them by:

1. Starting the server: `npm start`
2. Accessing the file via: `http://localhost:3001/translations/{BRANCH}/{language_id}/global.ini`
   - Example (Russian): `http://localhost:3001/translations/LIVE/ru/global.ini`
   - Example (Korean): `http://localhost:3001/translations/LIVE/ko/global.ini`
   - Example (English): `http://localhost:3001/translations/LIVE/en/global.ini`
