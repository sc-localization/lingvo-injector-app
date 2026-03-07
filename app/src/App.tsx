import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { version } from '../package.json';

import { appLanguages } from './constants';
import { useStores } from './stores/RootStore';
import styles from './App.module.scss';
import Select from './components/Select/Select';
import { useSettingsActions } from './hooks/useSettingsActions';
import { useUpdateActions } from './hooks/useUpdateActions';
import { useTranslationUpdateActions } from './hooks/useTranslationUpdateActions';
import Button from './components/Button/Button';
import Titlebar from './components/Titlebar/Titlebar';
import Terminal from './components/Terminal/Terminal';
import Panel from './components/Panel/Panel';
import Card from './components/Card/Card';
import Typography from './components/Typography/Typography';
import BackgroundEffects from './components/BackgroundEffects/BackgroundEffects';
import Grid from './components/Grid/Grid';
import Stack from './components/Stack/Stack';

const App = observer(() => {
  const { t } = useTranslation();
  const { settingsStore, uiStore } = useStores();
  const lastMismatchLoggedRef = useRef<string | null>(null);

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
      try {
        await Promise.all([loadSettings(), loadServerVersions()]);
        await initializeGameFolder(settingsStore.baseGameFolder);
        await refreshActiveLanguage();
        checkAppUpdates();
        checkTranslationUpdates();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log mismatch warning when it appears, but avoid infinite loops
  useEffect(() => {
    const currentMismatch =
      settingsStore.activeGameLanguageCodes[settingsStore.selectedGameVersion];

    if (
      settingsStore.activeGameLanguageName &&
      settingsStore.translationLanguageCode !== currentMismatch
    ) {
      const message = t('active_language_mismatch_warning');

      // Use ref to prevent logging the same warning repeatedly
      if (lastMismatchLoggedRef.current !== message) {
        uiStore.addLogEntry('system', message);
        lastMismatchLoggedRef.current = message;
      }
    } else {
      lastMismatchLoggedRef.current = null;
    }
  }, [
    settingsStore.activeGameLanguageName,
    settingsStore.translationLanguageCode,
    settingsStore.selectedGameVersion,
    settingsStore.activeGameLanguageCodes,
    uiStore,
    t,
  ]);

  const currentVersionStatus =
    uiStore.translationVersionStatuses[settingsStore.selectedGameVersion];

  const hasUpdateForCurrentVersion = currentVersionStatus?.hasUpdate ?? false;

  // Status text for the main panel
  const statusMessage = uiStore.message
    ? t(uiStore.message.key, uiStore.message.payload ?? {})
    : hasUpdateForCurrentVersion
      ? t('update_translation_btn')
      : t('no_updates_found');

  const statusColor = uiStore.message
    ? uiStore.message.type === 'error'
      ? 'danger'
      : uiStore.message.type === 'success'
        ? 'accent'
        : 'accent'
    : 'accent';

  return (
    <>
      <Titlebar />
      <BackgroundEffects />

      <main className={styles.appContainer}>
        {/* Header */}
        <header className={styles.header}>
          <Stack gap={5}>
            <Typography variant="title" as="h1">
              LINGVO INJECTOR
            </Typography>

            <Typography variant="subtitle" as="div">
              {t('title')}
            </Typography>
          </Stack>

          <Stack gap={5} className={styles.headerStatus}>
            <Typography variant="status">
              <span className={styles.statusDot} />
              SYS.ONLINE
            </Typography>

            <Typography variant="status">VER: {version}</Typography>
          </Stack>
        </header>

        {/* Main Panel */}
        <Panel title={t('target_directory')} className={styles.mainPanel}>
          <Stack gap={10} className={styles.folderBlock}>
            <Typography variant="label">
              {t('selected_folder_label')}
            </Typography>

            <Typography variant="path" as="div">
              {settingsStore.baseGameFolder || t('folder_not_selected')}
            </Typography>

            <Button onClick={selectGameFolder} disabled={uiStore.isDialogOpen}>
              {settingsStore.baseGameFolder
                ? t('change_base_game_folder_btn')
                : t('select_base_game_folder_btn')}
            </Button>
          </Stack>

          <Grid columns={2} gap={20} className={styles.hudGrid}>
            <Stack gap={20}>
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
                  <Typography color="warning" variant="body" as="p">
                    {t('no_translations_available')}
                  </Typography>
                )
              )}
            </Stack>

            <Stack gap={20}>
              {settingsStore.baseGameFolder && (
                <Select
                  labelKey="select_game_version"
                  options={settingsStore.availableVersions.map((version) => ({
                    id: version,
                    name: version,
                  }))}
                  value={settingsStore.selectedGameVersion}
                  onChange={changeGameVersion}
                />
              )}

              <Stack gap={0} className={styles.statusBlock}>
                <Stack direction="row" className={styles.statusLine}>
                  <Typography variant="body" color="dim">
                    {t('installed_version_label')}
                  </Typography>

                  <Typography variant="body" color="accent">
                    {currentVersionStatus?.installedVersion || '---'}
                  </Typography>
                </Stack>

                <Stack direction="row" className={styles.statusLine}>
                  <Typography variant="body" color="dim">
                    {t('available_version_label')}
                  </Typography>

                  <Typography variant="body" color="accent">
                    {currentVersionStatus?.serverVersion || '---'}
                  </Typography>
                </Stack>

                <Stack direction="row" className={styles.statusLineSeparated}>
                  <Typography variant="body" color="dim">
                    {t('active_language_label')}
                  </Typography>

                  <Typography variant="body">
                    {settingsStore.activeGameLanguageName?.toUpperCase() ||
                      '---'}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>

          <Card className={styles.installBlock}>
            <Stack direction="row" className={styles.statusRow}>
              <Typography variant="label" className={styles.label}>
                {t('status_label')}
              </Typography>

              <Typography
                variant="value"
                className={styles.value}
                color={statusColor}
              >
                {statusMessage}
              </Typography>
            </Stack>

            {settingsStore.availableVersions.length > 0 && (
              <Stack direction="row" gap={20} className={styles.installButtons}>
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
                  variant="danger"
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
              </Stack>
            )}
          </Card>
        </Panel>

        {/* Actions Panel */}
        <Panel className={styles.actionsPanel}>
          <Stack direction="row" gap={20} className={styles.actionButtons}>
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
          </Stack>

          <label className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={settingsStore.autoCheckTranslationUpdates}
              onChange={(e) =>
                settingsStore.setAutoCheckTranslationUpdates(e.target.checked)
              }
            />

            <div
              className={`${styles.checkmark} ${settingsStore.autoCheckTranslationUpdates ? styles.checked : ''}`}
            />

            <Typography variant="body">
              {t('auto_check_translation_updates')}
            </Typography>
          </label>

          <Stack gap={20} className={styles.separator}>
            <Button
              onClick={checkAppUpdates}
              disabled={uiStore.isCheckingUpdates}
            >
              {uiStore.isCheckingUpdates
                ? t('checking_for_updates')
                : t('check_for_app_updates_btn')}
            </Button>

            {uiStore.availableUpdate && (
              <Button onClick={installUpdate}>{t('install_update_btn')}</Button>
            )}
          </Stack>
        </Panel>

        {/* Terminal Wrapper */}
        <aside className={styles.terminalWrapper}>
          <Terminal />
        </aside>
      </main>
    </>
  );
});

export default App;
