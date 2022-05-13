import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {UserPhoto} from '../models/user-photo';
import {Capacitor} from '@capacitor/core';
import {Storage} from '@ionic/storage-angular';
import {Platform} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  photos: UserPhoto[] = [];

  constructor(
    private storage: Storage,
    private platform: Platform,
  ) {}

  async loadPictures() {
    const strList = await this.storage.get('ei-gallery');
    this.photos = strList || [];
    if(!this.platform.is('hybrid')) {
      for(const p of this.photos) {
        const read = await Filesystem.readFile({
          path: p.path,
          directory: Directory.Library
        });
        p.webPath = `data:image/jpeg;base64,${read.data}`;
      }
    }
  }

  async takePicture() {
    const photo = await Camera.getPhoto({
      quality: 100,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri,
    });
    this.savePicture(photo);
  }

  async chooseInGallery() {
    const photo = await Camera.getPhoto({
      quality: 100,
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri
    });
    this.savePicture(photo);
  }

  async chooseImageSource() {
    const photo = await Camera.getPhoto({
      quality: 100,
      source: CameraSource.Prompt,
      resultType: CameraResultType.Uri
    });
    this.savePicture(photo);
  }

  async savePicture(photo: Photo) {
    const b64 = await this.readAsBase64(photo);
    const path =  Date.now() + '.jpeg';
    const saved = await Filesystem.writeFile({
      path,
      data: b64,
      directory: Directory.Library
    });
    let userPhoto: UserPhoto;
    if(this.platform.is('hybrid')) {
      userPhoto = {path: saved.uri, webPath: Capacitor.convertFileSrc(saved.uri)};
    } else {
      userPhoto = {path, webPath: photo.webPath};
    }
    this.photos.unshift(userPhoto);
    await this.storage.set('ei-gallery', this.photos);
  }

  async readAsBase64(photo: Photo)  {
   if(this.platform.is('hybrid')) {
     const {data} = await Filesystem.readFile({
       path: photo.path
     });
     return data;
   }
   const responsePhoto = await fetch(photo.webPath);
   const blob = await responsePhoto.blob();
   return await this.blobToB64(blob) as string;

  }

  blobToB64(blob: Blob) {
    return new Promise((response, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => { response(reader.result); };
      reader.readAsDataURL(blob);
    });
  }

}
