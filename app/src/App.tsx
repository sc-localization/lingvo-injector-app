import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import { appLanguages, translationLanguages } from './constants';
import { useStores } from './stores/RootStore';
import Select from './components/Select/Select';
import { useSettingsActions } from './hooks/useSettingsActions';
import Button from './components/Button/Button';
import MessageDisplay from './components/MessageDisplay/MessageDisplay';

const App = observer(() => {
  const { t } = useTranslation();
  const { settingsStore, uiStore } = useStores();

  const {
    loadSettings,
    initializeGameFolder,
    changeAppLanguage,
    changeTranslationLanguage,
    changeGameVersion,
    selectGameFolder,
    installLocalization,
    uninstallLocalization,
  } = useSettingsActions();

  useEffect(() => {
    const init = async () => {
      await loadSettings();
      await initializeGameFolder(settingsStore.baseGameFolder); // авто-поиск при старте
    };

    init();
  }, [initializeGameFolder, loadSettings, settingsStore.baseGameFolder]);

  return (
    <div>
      <header>
        <h1>{t('title')}</h1>
      </header>

      <Select
        labelKey="select_app_language"
        options={appLanguages}
        value={settingsStore.selectedAppLanguage}
        onChange={changeAppLanguage}
      />

      <Select
        labelKey="select_translation_language"
        options={translationLanguages}
        value={settingsStore.selectedTranslationLanguage}
        onChange={changeTranslationLanguage}
      />

      {settingsStore.baseGameFolder && (
        <Select
          labelKey="select_game_version"
          options={settingsStore.availableVersions.map((version) => {
            return {
              id: version,
              name: version,
            };
          })}
          value={settingsStore.selectedGameVersion}
          onChange={changeGameVersion}
        />
      )}

      <MessageDisplay
        message={
          uiStore.message && {
            type: uiStore.message.type,
            text: t(uiStore.message.key, uiStore.message.payload ?? {}),
          }
        }
      />

      {settingsStore.baseGameFolder &&
        settingsStore.availableVersions.length > 0 && (
          <>
            <Button
              onClick={installLocalization}
              disabled={
                !settingsStore.baseGameFolder ||
                !settingsStore.selectedGameVersion
              }
            >
              {t('install_localization_btn')}
            </Button>
            <Button
              onClick={uninstallLocalization}
              disabled={
                !settingsStore.baseGameFolder ||
                !settingsStore.selectedGameVersion
              }
            >
              {t('remove_localization_btn')}
            </Button>
          </>
        )}

      <Button onClick={selectGameFolder}>
        {settingsStore.baseGameFolder
          ? t('change_base_game_folder_btn')
          : t('select_base_game_folder_btn')}
      </Button>
    </div>
  );
});

export default App;
