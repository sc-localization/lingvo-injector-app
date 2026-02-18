import { ServerVersionsResponse } from '../types';

/**
 * Fetch available versions and languages from server
 */
export const fetchVersions = async (): Promise<ServerVersionsResponse> => {
  const serverUrl = `${import.meta.env.VITE_SERVER_URL}/versions/versions.json`;

  try {
    const response = await fetch(serverUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch versions: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching versions:', error);
    throw error;
  }
};

/**
 * Fetch translation file from server
 *
 * Server structure uses language IDs (ru, ko, en, etc.) for paths:
 * - Russian: /translations/LIVE/ru/global.ini
 * - Korean: /translations/LIVE/ko/global.ini
 * - English: /translations/LIVE/en/global.ini
 *
 * @param version - Game version (LIVE, PTU, HOTFIX)
 * @param fileName - Path with language ID and filename (e.g., "ru/global.ini")
 * @returns Translation file content as string
 */
export const fetchTranslation = async (
  version: string,
  fileName: string
): Promise<string> => {
  const serverUrl = `${import.meta.env.VITE_SERVER_URL}/translations/${version}/${fileName}`;

  try {
    const response = await fetch(serverUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to download translation for version ${version}: ${response.statusText}`
      );
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching translation:', error);
    throw error;
  }
};
