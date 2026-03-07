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
    { type: 'system', text: 'Booting LINGVO kernel...' },
    { type: 'success', text: 'System ready.' },
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
      // Automatically log messages to the terminal
      this.addLogEntry(message.type, message.key); // Using key for now, we'll translate in component if needed or just pass text
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
