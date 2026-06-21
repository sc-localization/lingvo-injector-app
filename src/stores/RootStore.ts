import { UIStore } from './UIStore';
import { SettingsStore } from './SettingsStore';

export class RootStore {
  uiStore: UIStore;
  settingsStore: SettingsStore;

  constructor() {
    this.uiStore = new UIStore(this);
    this.settingsStore = new SettingsStore(this);
  }
}

const rootStore = new RootStore();

export const useStores = () => ({
  uiStore: rootStore.uiStore,
  settingsStore: rootStore.settingsStore,
});
