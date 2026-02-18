import { appLanguages, translationLanguages } from '../constants';

export type Message = {
  type: 'success' | 'error' | 'info';
  key: string;
  payload?: Record<string, string | number>;
} | null;

type AppLanguage = (typeof appLanguages)[number];
export type AppLanguages = readonly AppLanguage[];
export type AppLanguageId = AppLanguage['id']; // "en" | "ru"
export type AppLanguageCode = AppLanguage['code']; // "en" | "ru"

type TranslationLanguage = (typeof translationLanguages)[number];
export type TranslationLanguages = readonly TranslationLanguage[];
export type TranslationLanguageId = TranslationLanguage['id']; // "en" | "ru"
export type TranslationLanguageCode = TranslationLanguage['code']; // german_(germany) | korean_(south_korea) | etc.

export type GameVersion = 'LIVE' | 'PTU' | 'HOTFIX';
export type BaseGameFolder = string | null;
export type AvailableGameVersions = readonly GameVersion[];

export type ServerVersionInfo = {
  version: string;
  filename: string;
  notes: string;
  languages: string[];
};

export type ServerVersionsResponse = Record<string, ServerVersionInfo> & {
  baseUrl?: string;
};

export type AppSettings = {
  app_language: AppLanguageId;
  translation_language: TranslationLanguageId;
  base_game_folder: BaseGameFolder;
};
