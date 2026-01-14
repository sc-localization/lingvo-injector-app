import { makeAutoObservable } from 'mobx';
import type { Message } from '../types';
import { RootStore } from './RootStore';

export class UIStore {
  root: RootStore;

  // loading: boolean = false;
  message: Message = null;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  // setLoading = (loading: boolean) => {
  //   this.loading = loading;
  // };

  setMessage = (message: Message) => {
    this.message = message;
  };

  clearMessage = () => {
    this.message = null;
  };
}
