import { makeAutoObservable } from 'mobx';
import type { Message } from '../types';
import { RootStore } from './RootStore';

export class UIStore {
  root: RootStore;

  // loading: boolean = false;
  message: Message = null;
  isDialogOpen: boolean = false;

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
}
