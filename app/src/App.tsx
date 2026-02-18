import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import { appLanguages } from './constants';
import { useStores } from './stores/RootStore';
import Select from './components/Select/Select';
import { useSettingsActions } from './hooks/useSettingsActions';
import { useUpdateActions } from './hooks/useUpdateActions';
import Button from './components/Button/Button';
import MessageDisplay from './components/MessageDisplay/MessageDisplay';

const App = observer(() => {
  const { t } = useTranslation();
  const { settingsStore, uiStore } = useStores();

  const {
    loadSettings,
    loadServerVersions,
    initializeGameFolder,
    changeAppLanguage,
    changeTranslationLanguage,
    changeGameVersion,
    selectGameFolder,
    installLocalization,
    uninstallLocalization,
  } = useSettingsActions();

  const { checkUpdates, installUpdate } = useUpdateActions();

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadSettings(), loadServerVersions()]);
      await initializeGameFolder(settingsStore.baseGameFolder); // авто-поиск при старте
      checkUpdates();
    };

    init();
  }, [
    initializeGameFolder,
    loadSettings,
    loadServerVersions,
    settingsStore.baseGameFolder,
    checkUpdates,
  ]);

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

      {settingsStore.availableTranslationLanguages.length > 0 ? (
        <Select
          labelKey="select_translation_language"
          options={settingsStore.availableTranslationLanguages}
          value={settingsStore.selectedTranslationLanguage}
          onChange={changeTranslationLanguage}
        />
      ) : (
        settingsStore.selectedGameVersion &&
        settingsStore.serverVersions && (
          <p style={{ color: 'orange' }}>{t('no_translations_available')}</p>
        )
      )}

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

      {settingsStore.availableVersions.length > 0 && (
        <>
          <Button
            onClick={installLocalization}
            disabled={
              !settingsStore.baseGameFolder ||
              !settingsStore.selectedGameVersion ||
              settingsStore.availableTranslationLanguages.length === 0
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
      <Button onClick={selectGameFolder} disabled={uiStore.isDialogOpen}>
        {settingsStore.baseGameFolder
          ? t('change_base_game_folder_btn')
          : t('select_base_game_folder_btn')}
      </Button>

      <div
        style={{
          marginTop: '20px',
          borderTop: '1px solid #ccc',
          paddingTop: '10px',
        }}
      >
        <Button onClick={checkUpdates} disabled={uiStore.isCheckingUpdates}>
          {uiStore.isCheckingUpdates
            ? t('checking_for_updates')
            : t('check_for_updates_btn')}
        </Button>

        {uiStore.availableUpdate && (
          <Button onClick={installUpdate}>{t('install_update_btn')}</Button>
        )}
      </div>
    </div>
  );
});

export default App;
