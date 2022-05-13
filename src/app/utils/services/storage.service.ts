import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import {BehaviorSubject, from} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';
import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  ready$ = new BehaviorSubject(false);
  theme$ = new BehaviorSubject('');

  constructor(
    private storage: Storage,
    private messageService: MessageService
  ) { }

  async init() {
    console.log('Initializing storage...');
    await this.storage.create();
    this.ready$.next(true);
  }

  /* Syntaxe pour attendre la fin de la creation du storage : à utiliser
  si on doit utiliser le storage très rapidement, au démarrage de l'appli, en ayant
  le risque que la promesse du create() ne soit pas terminée
  => plutôt utile sur les ajouts
   */
  getChiant() {
    this.ready$
      .pipe(
        filter(bool => bool ),
        switchMap(() => from(this.storage.get('my_key')))
      );
  }

  async getTheme() {
    const t = await this.storage.get('theme');
    if(t) {
      this.theme$.next(t);
    }
  }

  async setTheme(theme: 'dark' | 'light') {
    await this.storage.set('theme', theme);
    this.theme$.next(theme);
    this.messageService.createToast(`Thème défini : ${theme}`, 'success');
  }

  clear() {
    this.storage.clear();
  }

  async delete(key) {
    const keys = await this.storage.keys();
    if(keys.includes(key)) {
      await this.storage.remove(key);
    }
  }




}
