import { makeAutoObservable, runInAction } from 'mobx';
import i18n from '../i18n';

import {
  AppLanguageId,
  AvailableGameVersions,
  BaseGameFolder,
  GameVersion,
  TranslationLanguageId,
  TranslationLanguageCode,
  ServerVersionsResponse,
  InstalledTranslations,
} from '../types';
import {
  findAvailableVersions,
  readSettings,
  tryAutoFindBaseFolder,
  writeSettings,
} from '../services/settingsService';
import { readLanguageConfig } from '../services/localizationService';
import { RootStore } from './RootStore';
import { translationLanguages } from '../constants';
import { fetchVersions } from '../api/translationApi';

export class SettingsStore {
  root: RootStore;

  selectedAppLanguage: AppLanguageId = 'en';
  selectedTranslationLanguage: TranslationLanguageId = 'en';
  selectedGameVersion: GameVersion = 'LIVE';
  baseGameFolder: BaseGameFolder = null;
  availableVersions: AvailableGameVersions = [];
  serverVersions: ServerVersionsResponse | null = null;
  installedTranslations: InstalledTranslations = {};
  autoCheckTranslationUpdates: boolean = false;
  activeGameLanguageCodes: Partial<Record<GameVersion, string | null>> = {};

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  // Computed getter for translation language code
  get translationLanguageCode(): TranslationLanguageCode {
    const language = translationLanguages.find(
      (lang) => lang.id === this.selectedTranslationLanguage
    );
    return language?.code ?? 'english';
  }

  get activeGameLanguageName(): string | null {
    const code = this.activeGameLanguageCodes[this.selectedGameVersion];
    if (!code) return null;
    const lang = translationLanguages.find((l) => l.code === code);
    return lang?.name ?? code;
  }

  // Computed getter for available translation languages for the selected version
  get availableTranslationLanguages() {
    if (!this.serverVersions || !this.selectedGameVersion) {
      return [];
    }

    const versionInfo = this.serverVersions[this.selectedGameVersion];
    if (!versionInfo || !versionInfo.languages) {
      return [];
    }

    return translationLanguages.filter(
      (lang) => lang.id in versionInfo.languages
    );
  }

  setAppLanguage = (languageId: AppLanguageId) => {
    this.selectedAppLanguage = languageId;
    i18n.changeLanguage(languageId);
  };

  setTranslationLanguage = (languageId: TranslationLanguageId) => {
    this.selectedTranslationLanguage = languageId;
  };

  setSelectedGameVersion = (version: GameVersion) => {
    this.selectedGameVersion = version;
    // Reset translation language if not available for this version
    const available = this.availableTranslationLanguages;
    if (
      available.length > 0 &&
      !available.find((l) => l.id === this.selectedTranslationLanguage)
    ) {
      this.setTranslationLanguage(available[0].id as TranslationLanguageId);
    }
  };

  setBaseGameFolder = (folder: BaseGameFolder) => {
    this.baseGameFolder = folder;
  };

  private setAvailableVersions = (versions: AvailableGameVersions) => {
    this.availableVersions = versions;
  };

  setAutoCheckTranslationUpdates = (enabled: boolean) => {
    this.autoCheckTranslationUpdates = enabled;
    this.saveSettings();
  };

  setInstalledTranslation = (
    gameVersion: GameVersion,
    languageId: TranslationLanguageId,
    version: string
  ) => {
    const key = `${gameVersion}_${languageId}`;
    this.installedTranslations = {
      ...this.installedTranslations,
      [key]: {
        version,
        installedAt: new Date().toISOString(),
        languageId,
      },
    };
  };

  removeInstalledTranslation = (
    gameVersion: GameVersion,
    languageId: TranslationLanguageId
  ) => {
    const key = `${gameVersion}_${languageId}`;
    const copy = { ...this.installedTranslations };
    delete copy[key];
    this.installedTranslations = copy;
  };

  loadActiveGameLanguage = async (version: GameVersion) => {
    if (!this.baseGameFolder) return;
    try {
      const code = await readLanguageConfig(this.baseGameFolder, version);
      runInAction(() => {
        this.activeGameLanguageCodes = {
          ...this.activeGameLanguageCodes,
          [version]: code,
        };
      });
    } catch (error) {
      console.error('Failed to read active game language:', error);
    }
  };

  loadServerVersions = async () => {
    try {
      const versions = await fetchVersions();
      runInAction(() => {
        this.serverVersions = versions;
      });
    } catch (error) {
      console.error('Failed to load server versions:', error);
    }
  };

  initGameFolder = async (
    initialPath: BaseGameFolder = null
  ): Promise<{
    success: boolean;
    folder?: string | null;
    versions?: AvailableGameVersions;
    error?: string;
  }> => {
    try {
      const foundPath = initialPath || (await tryAutoFindBaseFolder());
      this.setBaseGameFolder(foundPath);

      if (foundPath) {
        const versions = await findAvailableVersions(this.baseGameFolder);

        // если версий нет значит игра там не обнаружена вывести сообщение
        const upperVersions = versions.map(
          (v) => v.toUpperCase() as GameVersion
        );
        this.setAvailableVersions(upperVersions);

        if (
          upperVersions.length > 0 &&
          !upperVersions.includes(this.selectedGameVersion)
        ) {
          this.setSelectedGameVersion(upperVersions[0]);
        }

        return { success: true, folder: foundPath, versions: upperVersions };
      } else {
        return { success: false, folder: null };
      }
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      console.error(`Not found game folder: ${errMessage}`);

      return { success: false, error: errMessage };
    } finally {
      this.saveSettings();
    }
  };

  loadSettings = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const settings = await readSettings();
      console.log(settings);

      this.setAppLanguage(settings.app_language);
      this.setTranslationLanguage(settings.translation_language);
      this.setBaseGameFolder(settings.base_game_folder);
      this.installedTranslations = settings.installed_translations ?? {};
      this.autoCheckTranslationUpdates =
        settings.auto_check_translation_updates ?? false;

      return { success: true };
    } catch (error) {
      this.selectedAppLanguage = 'en'; // fallback if error
      i18n.changeLanguage('en');

      const errMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error reading settings: ${errMessage}`);

      return { success: false, error: errMessage };
    }
  };

  saveSettings = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await writeSettings({
        app_language: this.selectedAppLanguage,
        translation_language: this.selectedTranslationLanguage,
        base_game_folder: this.baseGameFolder,
        installed_translations: this.installedTranslations,
        auto_check_translation_updates: this.autoCheckTranslationUpdates,
      });

      return { success: true };
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      console.error('Error writing settings:', errMessage);

      return { success: false, error: errMessage };
    }
  };
}
