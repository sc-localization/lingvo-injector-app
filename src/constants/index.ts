export const appLanguages = [
  { id: 'en', name: 'English', code: 'en' },
  { id: 'ru', name: 'Русский', code: 'ru' },
  // { id: 'fr', name: 'French', code: 'fr' },
  // TODO: Add more languages. The Id parameter must be in ISO 639 standard
] as const;

export const translationLanguages = [
  // IMPORTANT: Star Citizen does not natively support Cyrillic characters.
  // Russian translation uses 'korean_(south_korea)' code as a workaround because
  // the Korean locale folder supports non-Latin characters including Cyrillic.
  // NOTE: Both Russian and Korean use the same game code 'korean_(south_korea)'.
  // The app uses language ID (ru/ko) for server paths but installs to the same folder.
  // This means only ONE can be active in the game at a time (last installed wins).
  { id: 'ru', name: 'Русский', code: 'korean_(south_korea)' },
  { id: 'zh', name: 'Chinese (Simplified)', code: 'chinese_(simplified)' },
  { id: 'en', name: 'English', code: 'english' },
  { id: 'fr', name: 'French', code: 'french_(france)' },
  { id: 'de', name: 'German', code: 'german_(germany)' },
  { id: 'it', name: 'Italian', code: 'italian_(italy)' },
  { id: 'ja', name: 'Japanese', code: 'japanese_(japan)' },
  { id: 'ko', name: '한국어 (Korean)', code: 'korean_(south_korea)' },
  { id: 'pl', name: 'Polish', code: 'polish_(poland)' },
  { id: 'pt', name: 'Portuguese', code: 'portuguese_(brazil)' },
  { id: 'es', name: 'Spanish', code: 'spanish_(spain)' },
] as const;
