import { Injectable } from '@angular/core';
import {AlertController, AlertOptions, ToastController, ToastOptions} from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  async createToast(message = 'Hello World !',
                    color: 'success' | 'warning' | 'danger' | 'dark' =  'warning') {
    const config: ToastOptions = {
      message,
      icon: 'cafe-outline',
      color,
      position: 'bottom',
      duration: 5000,
    };
    const toast = await this.toastController.create(config);
    await toast.present();
  }

  async createConfirm(header: string, message: string, callback: () => void) {
    const config: AlertOptions = {
      message,
      header,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: callback
        }
      ]
    };
    const alert = await this.alertController.create(config);
    await alert.present();
  }




}
