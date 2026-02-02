import { makeAutoObservable } from 'mobx';
import { Update } from '@tauri-apps/plugin-updater';
import type { Message } from '../types';
import { RootStore } from './RootStore';

export class UIStore {
  root: RootStore;

  // loading: boolean = false;
  message: Message = null;
  isDialogOpen: boolean = false;
  availableUpdate: Update | null = null;
  isCheckingUpdates: boolean = false;

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
}
