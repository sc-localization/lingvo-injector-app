import { useCallback } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { useTranslation } from 'react-i18next';
import {
  AppLanguageId,
  TranslationLanguageId,
  GameVersion,
  BaseGameFolder,
} from '../types';
import { useStores } from '../stores/RootStore';
import {
  setLanguageConfig,
  removeLocalization,
  writeTextFile,
} from '../services/localizationService';
import { fetchTranslation } from '../api/translationApi';

export const useSettingsActions = () => {
  const { t } = useTranslation();
  const { settingsStore, uiStore } = useStores();

  const showError = useCallback((key: string, error?: string) => {
    uiStore.setMessage({
      type: 'error',
      key: key,
      payload: { error: error || '' },
    });
  }, []);

  const loadSettings = useCallback(async () => {
    const result = await settingsStore.loadSettings();

    if (!result.success && result.error) {
      showError('settings_load_error', result.error);
    }
  }, []);

  const loadServerVersions = useCallback(async () => {
    await settingsStore.loadServerVersions();
  }, []);

  const saveSettings = useCallback(async () => {
    const result = await settingsStore.saveSettings();

    if (!result.success && result.error) {
      showError('settings_save_error', result.error);
    }
  }, []);

  const changeAppLanguage = useCallback(async (languageId: AppLanguageId) => {
    settingsStore.setAppLanguage(languageId);
    await saveSettings();
  }, []);

  const changeTranslationLanguage = useCallback(
    async (languageId: TranslationLanguageId) => {
      settingsStore.setTranslationLanguage(languageId);
      await saveSettings();
    },
    []
  );

  const refreshActiveLanguage = useCallback(async () => {
    if (settingsStore.selectedGameVersion) {
      await settingsStore.loadActiveGameLanguage(
        settingsStore.selectedGameVersion
      );
    }
  }, []);

  const changeGameVersion = useCallback(async (version: GameVersion) => {
    settingsStore.setSelectedGameVersion(version);
    await settingsStore.loadActiveGameLanguage(version);
  }, []);

  const initializeGameFolder = useCallback(
    async (initialPath: BaseGameFolder = null) => {
      const result = await settingsStore.initGameFolder(initialPath);

      if (!result.success && !result.error) {
        uiStore.setMessage({
          type: 'info',
          key: 'game_folder_not_found',
        });
      } else if (result.error) {
        showError('initialize_game_folder_error', result.error);
      }
    },
    []
  );

  const selectGameFolder = useCallback(async () => {
    if (uiStore.isDialogOpen) return;

    try {
      uiStore.setDialogOpen(true);
      const selectedPath = await open({
        multiple: false,
        directory: true,
        title: t('select_folder_dialog_title'),
      });

      if (selectedPath) {
        await initializeGameFolder(selectedPath);
      }
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      uiStore.setMessage({
        type: 'error',
        key: 'select_folder_dialog_error',
        payload: { error: errMessage },
      });
    } finally {
      uiStore.setDialogOpen(false);
    }
  }, [initializeGameFolder, t, uiStore]);

  const installLocalization = useCallback(async () => {
    if (
      !settingsStore.baseGameFolder ||
      !settingsStore.selectedGameVersion ||
      !settingsStore.translationLanguageCode
    ) {
      showError('install_localization_error', 'Missing required settings');
      return;
    }

    uiStore.setMessage({ type: 'info', key: 'installing_localization' });

    try {
      // 1. Set language config and create localization folder
      const locPath = await setLanguageConfig(
        settingsStore.baseGameFolder,
        settingsStore.translationLanguageCode,
        settingsStore.selectedGameVersion
      );

      // 2. Download translation file from server
      // Use language ID (ru, ko, etc.) for server path, not the game code
      const fileName = 'global.ini';
      const translationContent = await fetchTranslation(
        settingsStore.selectedGameVersion,
        `${settingsStore.selectedTranslationLanguage}/${fileName}`
      );

      // 3. Write translation file to localization folder
      await writeTextFile(`${locPath}/${fileName}`, translationContent);

      // 4. Record installed translation version
      const serverVersion =
        settingsStore.serverVersions?.[settingsStore.selectedGameVersion]
          ?.languages?.[settingsStore.selectedTranslationLanguage]?.version ??
        'unknown';
      settingsStore.setInstalledTranslation(
        settingsStore.selectedGameVersion,
        settingsStore.selectedTranslationLanguage,
        serverVersion
      );
      await saveSettings();

      // Update version status in UI
      uiStore.setTranslationVersionStatuses({
        ...uiStore.translationVersionStatuses,
        [settingsStore.selectedGameVersion]: {
          installedVersion: serverVersion,
          serverVersion,
          hasUpdate: false,
        },
      });

      await refreshActiveLanguage();

      uiStore.setMessage({
        type: 'success',
        key: 'install_localization_success',
      });
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      showError('install_localization_error', errMessage);
    }
  }, [settingsStore, uiStore, refreshActiveLanguage]);

  const uninstallLocalization = useCallback(async () => {
    if (
      !settingsStore.baseGameFolder ||
      !settingsStore.selectedGameVersion ||
      !settingsStore.translationLanguageCode
    ) {
      showError('remove_localization_error', 'Missing required settings');
      return;
    }

    uiStore.setMessage({ type: 'info', key: 'removing_localization' });

    try {
      await removeLocalization(
        settingsStore.baseGameFolder,
        settingsStore.translationLanguageCode,
        settingsStore.selectedGameVersion
      );

      settingsStore.removeInstalledTranslation(
        settingsStore.selectedGameVersion,
        settingsStore.selectedTranslationLanguage
      );
      await saveSettings();

      // Update version status in UI
      const currentStatus =
        uiStore.translationVersionStatuses[settingsStore.selectedGameVersion];
      if (currentStatus) {
        uiStore.setTranslationVersionStatuses({
          ...uiStore.translationVersionStatuses,
          [settingsStore.selectedGameVersion]: {
            ...currentStatus,
            installedVersion: null,
            hasUpdate: false,
          },
        });
      }

      await refreshActiveLanguage();

      uiStore.setMessage({
        type: 'success',
        key: 'remove_localization_success',
      });
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      showError('remove_localization_error', errMessage);
    }
  }, [settingsStore, uiStore, refreshActiveLanguage]);

  return {
    loadSettings,
    loadServerVersions,
    initializeGameFolder,
    changeAppLanguage,
    changeTranslationLanguage,
    changeGameVersion,
    selectGameFolder,
    installLocalization,
    uninstallLocalization,
    refreshActiveLanguage,
  };
};
