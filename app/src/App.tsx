import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import { appLanguages } from './constants';
import { useStores } from './stores/RootStore';
import Select from './components/Select/Select';
import { useSettingsActions } from './hooks/useSettingsActions';
import { useUpdateActions } from './hooks/useUpdateActions';
import { useTranslationUpdateActions } from './hooks/useTranslationUpdateActions';
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
    refreshActiveLanguage,
  } = useSettingsActions();

  const { checkAppUpdates, installUpdate } = useUpdateActions();

  const { checkTranslationUpdates, updateTranslation } =
    useTranslationUpdateActions(installLocalization);

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadSettings(), loadServerVersions()]);
      await initializeGameFolder(settingsStore.baseGameFolder);
      await refreshActiveLanguage();
      checkAppUpdates();
      checkTranslationUpdates();
    };

    init();
  }, [
    initializeGameFolder,
    loadSettings,
    loadServerVersions,
    settingsStore.baseGameFolder,
    checkAppUpdates,
    checkTranslationUpdates,
    refreshActiveLanguage,
  ]);

  const currentVersionStatus =
    uiStore.translationVersionStatuses[settingsStore.selectedGameVersion];

  const hasUpdateForCurrentVersion = currentVersionStatus?.hasUpdate ?? false;

  return (
    <div>
      <header>
        <h1>{t('title')}</h1>
      </header>

      <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '5px' }}>
        {settingsStore.baseGameFolder
          ? t('selected_folder', { folder: settingsStore.baseGameFolder })
          : t('folder_not_selected')}
      </p>
      <Button onClick={selectGameFolder} disabled={uiStore.isDialogOpen}>
        {settingsStore.baseGameFolder
          ? t('change_base_game_folder_btn')
          : t('select_base_game_folder_btn')}
      </Button>

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

      {currentVersionStatus && (
        <p style={{ fontSize: '0.85em', color: '#888' }}>
          {currentVersionStatus.installedVersion
            ? t('translation_installed_version', {
                version: currentVersionStatus.installedVersion,
              })
            : t('no_translation_installed')}
          {' · '}
          {t('translation_server_version', {
            version: currentVersionStatus.serverVersion,
          })}
        </p>
      )}

      <p style={{ fontSize: '0.85em', color: '#888' }}>
        {settingsStore.activeGameLanguageName
          ? t('active_game_language', {
              language: settingsStore.activeGameLanguageName,
            })
          : t('no_active_language')}
      </p>

      {settingsStore.activeGameLanguageName &&
        settingsStore.translationLanguageCode !==
          settingsStore.activeGameLanguageCodes[
            settingsStore.selectedGameVersion
          ] && (
          <p style={{ fontSize: '0.85em', color: 'orange' }}>
            {t('active_language_mismatch_warning')}
          </p>
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
              !settingsStore.selectedGameVersion ||
              !settingsStore.installedTranslations[
                `${settingsStore.selectedGameVersion}_${settingsStore.selectedTranslationLanguage}`
              ]
            }
          >
            {t('remove_localization_btn')}
          </Button>
        </>
      )}

      <div
        style={{
          marginTop: '20px',
          borderTop: '1px solid #ccc',
          paddingTop: '10px',
        }}
      >
        <Button
          onClick={checkTranslationUpdates}
          disabled={uiStore.isCheckingTranslationUpdates}
        >
          {uiStore.isCheckingTranslationUpdates
            ? t('checking_translation_updates')
            : t('check_translation_updates_btn')}
        </Button>

        <Button
          onClick={updateTranslation}
          disabled={!hasUpdateForCurrentVersion}
        >
          {t('update_translation_btn')}
        </Button>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '8px',
            fontSize: '0.9em',
          }}
        >
          <input
            type="checkbox"
            checked={settingsStore.autoCheckTranslationUpdates}
            onChange={(e) =>
              settingsStore.setAutoCheckTranslationUpdates(e.target.checked)
            }
          />
          {t('auto_check_translation_updates')}
        </label>
      </div>

      <div
        style={{
          marginTop: '20px',
          borderTop: '1px solid #ccc',
          paddingTop: '10px',
        }}
      >
        <Button onClick={checkAppUpdates} disabled={uiStore.isCheckingUpdates}>
          {uiStore.isCheckingUpdates
            ? t('checking_for_updates')
            : t('check_for_app_updates_btn')}
        </Button>

        {uiStore.availableUpdate && (
          <Button onClick={installUpdate}>{t('install_update_btn')}</Button>
        )}
      </div>
    </div>
  );
});

export default App;
