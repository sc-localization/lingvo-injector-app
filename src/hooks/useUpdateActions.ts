import { useCallback } from 'react';
import { useStores } from '../stores/RootStore';
import {
  checkForAppUpdates,
  installAppUpdate,
} from '../services/updateService';

export const useUpdateActions = () => {
  const { uiStore } = useStores();

  const checkAppUpdates = useCallback(async () => {
    uiStore.setIsCheckingUpdates(true);
    uiStore.clearMessage();

    try {
      const update = await checkForAppUpdates();
      if (update) {
        uiStore.setAvailableUpdate(update);

        uiStore.setMessage({
          type: 'info',
          key: 'update_available',
          payload: { version: update.version },
        });
      } else {
        uiStore.setAvailableUpdate(null);

        uiStore.setMessage({ type: 'info', key: 'no_updates_found' });
      }
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      uiStore.setMessage({
        type: 'error',
        key: 'update_error',
        payload: { error: errMessage },
      });
    } finally {
      uiStore.setIsCheckingUpdates(false);
    }
  }, [uiStore]);

  const installUpdate = useCallback(async () => {
    if (uiStore.availableUpdate) {
      try {
        await installAppUpdate(uiStore.availableUpdate);
      } catch (error) {
        const errMessage =
          error instanceof Error ? error.message : String(error);

        uiStore.setMessage({
          type: 'error',
          key: 'update_error',
          payload: { error: errMessage },
        });
      }
    }
  }, [uiStore]);

  return {
    checkAppUpdates,
    installUpdate,
  };
};
