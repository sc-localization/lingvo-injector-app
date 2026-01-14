import { invoke } from '@tauri-apps/api/core';
import { AppSettings, AvailableGameVersions, BaseGameFolder } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAppSettings = (obj: any): obj is AppSettings => {
  // TODO: add more validation
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.app_language === 'string' &&
    ['en', 'ru'].includes(obj.app_language)
  );
};

export const readSettings = async (): Promise<AppSettings> => {
  try {
    const settingsJson = await invoke<string>('read_settings');
    const parsedSettings = JSON.parse(settingsJson);

    if (!isAppSettings(parsedSettings)) {
      throw new Error('Invalid settings format when reading');
    }

    return parsedSettings;
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);

    throw new Error(`Failed to read settings: ${errMessage}`);
  }
};

export const writeSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await invoke('write_settings', { settingsJson: JSON.stringify(settings) });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);

    throw new Error(`Failed to write settings: ${errMessage}`);
  }
};

export const tryAutoFindBaseFolder = async (): Promise<BaseGameFolder> => {
  try {
    return await invoke<BaseGameFolder>('try_auto_find_base_folder');
  } catch (error) {
    console.error('Error finding base folder:', error);
    return null;
  }
};

export const findAvailableVersions = async (
  baseFolderPath: BaseGameFolder
): Promise<AvailableGameVersions> => {
  try {
    return await invoke<AvailableGameVersions>('find_available_versions', {
      baseFolderPath,
    });
  } catch (error) {
    console.error('Error finding versions:', error);
    return [];
  }
};
