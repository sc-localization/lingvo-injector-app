import { makeAutoObservable } from 'mobx';
import { Update } from '@tauri-apps/plugin-updater';
import type { Message, TranslationVersionStatuses } from '../types';
import { RootStore } from './RootStore';

export type LogEntry = {
  type: 'system' | 'success' | 'error' | 'info';
  text: string;
};

export class UIStore {
  root: RootStore;

  // loading: boolean = false;
  message: Message = null;
  isDialogOpen: boolean = false;
  availableUpdate: Update | null = null;
  isCheckingUpdates: boolean = false;
  translationVersionStatuses: TranslationVersionStatuses = {};
  isCheckingTranslationUpdates: boolean = false;
  logEntries: LogEntry[] = [
    { type: 'system', text: 'boot_kernel' },
    { type: 'system', text: 'boot_mount_fs' },
    { type: 'success', text: 'boot_fs_ok' },
    { type: 'system', text: 'boot_loading_manifest' },
    { type: 'success', text: 'boot_ready' },
  ];

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  // setLoading = (loading: boolean) => {
  //   this.loading = loading;
  // };

  setDialogOpen = (isOpen: boolean) => {
    this.isDialogOpen = isOpen;
  };

  setMessage = (message: Message) => {
    this.message = message;
    if (message) {
      // Only show update notifications as info (yellow), everything else as system
      const UPDATE_KEYS = ['update_available', 'translation_updates_available'];
      const logType = UPDATE_KEYS.includes(message.key)
        ? 'info'
        : message.type === 'info'
          ? 'system'
          : message.type;
      this.addLogEntry(logType, message.key);
    }
  };

  clearMessage = () => {
    this.message = null;
  };

  setAvailableUpdate = (update: Update | null) => {
    this.availableUpdate = update;
  };

  setIsCheckingUpdates = (checking: boolean) => {
    this.isCheckingUpdates = checking;
  };

  setTranslationVersionStatuses = (statuses: TranslationVersionStatuses) => {
    this.translationVersionStatuses = statuses;
  };

  setIsCheckingTranslationUpdates = (checking: boolean) => {
    this.isCheckingTranslationUpdates = checking;
  };

  addLogEntry = (type: LogEntry['type'], text: string) => {
    this.logEntries.push({ type, text });
  };
}
