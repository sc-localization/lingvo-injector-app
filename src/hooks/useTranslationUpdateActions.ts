import { useCallback, useEffect, useRef } from 'react';
import { useStores } from '../stores/RootStore';
import { TranslationVersionStatuses } from '../types';

const AUTO_CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

export const useTranslationUpdateActions = (
  installLocalization: () => Promise<void>
) => {
  const { settingsStore, uiStore } = useStores();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkTranslationUpdates = useCallback(async () => {
    uiStore.setIsCheckingTranslationUpdates(true);
    try {
      await settingsStore.loadServerVersions();
      const statuses: TranslationVersionStatuses = {};
      for (const version of settingsStore.availableVersions) {
        const serverVersion =
          settingsStore.serverVersions?.[version]?.languages?.[
            settingsStore.selectedTranslationLanguage
          ]?.version;
        if (!serverVersion) continue;
        const key = `${version}_${settingsStore.selectedTranslationLanguage}`;
        const installed = settingsStore.installedTranslations[key];
        statuses[version] = {
          installedVersion: installed?.version ?? null,
          serverVersion,
          hasUpdate: !!installed && installed.version !== serverVersion,
        };
      }
      uiStore.setTranslationVersionStatuses(statuses);
      const outdated = Object.entries(statuses)
        .filter(([, s]) => s.hasUpdate)
        .map(([v]) => v);
      if (outdated.length > 0) {
        uiStore.setMessage({
          type: 'info',
          key: 'translation_updates_available',
          payload: { versions: outdated.join(', ') },
        });
      } else {
        uiStore.setMessage({ type: 'info', key: 'translations_up_to_date' });
      }
    } catch (error) {
      uiStore.setMessage({
        type: 'error',
        key: 'translation_update_error',
        payload: { error: String(error) },
      });
    } finally {
      uiStore.setIsCheckingTranslationUpdates(false);
    }
  }, [settingsStore, uiStore]);

  const updateTranslation = useCallback(async () => {
    await installLocalization();
  }, [installLocalization]);

  // Auto-check interval
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (settingsStore.autoCheckTranslationUpdates) {
      intervalRef.current = setInterval(() => {
        checkTranslationUpdates();
      }, AUTO_CHECK_INTERVAL_MS);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [settingsStore.autoCheckTranslationUpdates, checkTranslationUpdates]);

  return {
    checkTranslationUpdates,
    updateTranslation,
  };
};
