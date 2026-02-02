import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export const checkForAppUpdates = async (): Promise<Update | null> => {
  try {
    const update = await check();

    if (update) {
      console.log(
        `Found update ${update.version} from ${update.date} with notes ${update.body}`
      );

      return update;
    }
  } catch (error) {
    console.error('Error checking for updates:', error);

    throw error;
  }

  return null;
};

export const installAppUpdate = async (update: Update): Promise<void> => {
  await update.downloadAndInstall();

  await relaunch();
};
