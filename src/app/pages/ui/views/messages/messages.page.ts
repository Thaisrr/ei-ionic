import { Component, OnInit } from '@angular/core';
import {AlertController, AlertOptions, ToastController, ToastOptions} from '@ionic/angular';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage  {

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
      position: 'top',
      duration: 5000,
      cssClass: 'my-class'
    };
    const toast = await this.toastController.create(config);
    await toast.present();
  }

  async createAlert() {
    const config: AlertOptions = {
      header: 'Attention !',
      subHeader: 'Ceci est une information importante',
      message: `Il n'y a plus de café !`,
      buttons: [
        {
          text: 'Paniquer',
          role: 'panic',
          cssClass: 'secondary',
          handler: (() => {
            this.createToast('AAAAAAaaaaaaaaaaah', 'danger');
          })
        },
        {
          text: 'En refaire',
          role: 'do-it',
          cssClass: 'primary',
          handler: (() => {
            this.createToast('Mission accomplished !', 'success');
          })
        }
      ],
    };
    const alert = await this.alertController.create(config);
    await alert.present();

    const {role} = await alert.onDidDismiss();
    console.log('On dismiss role : ' + role);
  }

  async createPrompt() {
    const alert = await this.alertController.create({
      header: 'Are you ok ?',
      inputs: [
        {
          label: 'Name',
          type: 'text',
          name: 'name'
        },
        {
          label: 'Oui',
          type: 'radio',
          name: 'ok',
          value: 'yes',
          handler: () => {
            console.log('Yes selected');
          }
        },
        {
          label: 'Non',
          type: 'radio',
          name: 'ok',
          value: 'no',
          handler: () => {
            console.log('No selected');
          }
        },
      ],
      buttons: ['OK']
    });
    await alert.present();
    const {data} = await alert.onDidDismiss();
    console.log(data);
  }
}

