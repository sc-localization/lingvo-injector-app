import { invoke } from '@tauri-apps/api/core';
import {
  BaseGameFolder,
  GameVersion,
  TranslationLanguageCode,
} from '../types';

/**
 * Set language configuration in user.cfg and create Localization folder
 * @param baseFolder - Base game folder path
 * @param languageCode - Translation language code (e.g., 'korean_(south_korea)')
 * @param version - Game version (LIVE, PTU, HOTFIX)
 * @returns Path to the created localization folder
 */
export const setLanguageConfig = async (
  baseFolder: BaseGameFolder,
  languageCode: TranslationLanguageCode,
  version: GameVersion
): Promise<string> => {
  try {
    const localizationPath = await invoke<string>('set_language_config', {
      baseFolderPath: baseFolder,
      selectedLanguageCode: languageCode,
      selectedVersion: version,
    });

    return localizationPath;
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to set language config: ${errMessage}`);
  }
};

/**
 * Remove localization folder and clean user.cfg
 * @param baseFolder - Base game folder path
 * @param languageCode - Translation language code (e.g., 'korean_(south_korea)')
 * @param version - Game version (LIVE, PTU, HOTFIX)
 */
export const removeLocalization = async (
  baseFolder: BaseGameFolder,
  languageCode: TranslationLanguageCode,
  version: GameVersion
): Promise<void> => {
  try {
    await invoke('remove_localization', {
      baseFolderPath: baseFolder,
      selectedLanguageCode: languageCode,
      selectedVersion: version,
    });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to remove localization: ${errMessage}`);
  }
};

/**
 * Write text content to a file
 * @param path - File path
 * @param content - File content
 */
export const writeTextFile = async (
  path: string,
  content: string
): Promise<void> => {
  try {
    await invoke('write_text_file', {
      path,
      content,
    });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to write file: ${errMessage}`);
  }
};
