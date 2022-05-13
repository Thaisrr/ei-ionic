import {Injectable} from '@angular/core';
import {Directory, Encoding, Filesystem, PermissionStatus} from '@capacitor/filesystem';
import {MessageService} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private messageService: MessageService
  ) { }

  async requestPermission() {
    const permission: PermissionStatus = await Filesystem.checkPermissions();
    if(permission.publicStorage !== 'granted') {
      try {
        await Filesystem.requestPermissions();
      } catch (e) {
        console.error(e);
        this.messageService.createToast(`Impossible d'accéder aux dossiers`, 'danger');
      }
    }
  }

  /*
  Directory :
  - Documents : accessible seulement sur quelques versions récentes d'Android (11 et 12)
  - ExternalStorage  : accessible uniquement sur les 11+
  - External : ne nécéssite pas d'autorisation, accessibilité OK pour les différentes versions.
  Tout est supprimer quand on désinstalle l'appli
   */

  async write(txt: string, file: string) {
    if(!file.includes('.txt')) {
      file += '.txt';
    }
    try {
      await Filesystem.writeFile({
        data: txt,
        path: file,
        directory: Directory.External,
        encoding: Encoding.UTF8
      });
      await this.messageService.createToast(`Fichier créé`, 'success');
    } catch (e) {
        console.error(e);
        await this.messageService.createToast(`Impossible de créer le fichier`, 'danger');
    }
  }

  async read(file) {
    try {
      return await Filesystem.readFile({
        path: file,
        directory: Directory.External,
        encoding: Encoding.UTF8
      });
    } catch (e) {
      console.error(e);
      await this.messageService.createToast(`Le fichier n'existe pas`, 'danger');
    }
  }

  async append(text, file) {
    try {
      await Filesystem.appendFile({
        data: `\n${text}`,
        path: file,
        directory: Directory.External,
        encoding: Encoding.UTF8
      });
      await this.messageService.createToast(`Fichier modifié`, 'success');
    } catch (e) {
      console.error(e);
      await this.messageService.createToast(`Impossible de modifier le fichier`, 'danger');
    }
  }

  async delete(file) {
    try {
      await Filesystem.deleteFile({
        path: file,
        directory: Directory.External
      });
      await this.messageService.createToast(`Fichier supprimé`, 'success');
    } catch (e) {
      console.error(e);
      await this.messageService.createToast(`Impossible de supprimer le fichier`, 'danger');
    }
  }

  async getAll() {
    try {
      {
        return await Filesystem.readdir({
          directory: Directory.External,
          path: ''
        });
      }
    } catch (e) {
      console.error(e);
      await this.messageService.createToast(`Impossible de lire le dossier`, 'danger');
    }
  }
}
