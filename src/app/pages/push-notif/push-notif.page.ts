import { Component, OnInit } from '@angular/core';
import {PushNotifications, PushNotificationSchema} from '@capacitor/push-notifications';
import {MessageService} from '../../utils/services/message.service';

@Component({
  selector: 'app-push-notif',
  templateUrl: './push-notif.page.html',
  styleUrls: ['./push-notif.page.scss'],
})
export class PushNotifPage implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.requestPermission();
    this.listener();
  }

  async requestPermission() {
    let {receive} = await PushNotifications.checkPermissions();
    if(receive !== 'granted') {
      receive = (await PushNotifications.requestPermissions()).receive;
    }
    if(receive === 'granted') {
      PushNotifications.register();
      this.messageService.createToast(`Notifications push autorisées`, 'success');
    } else {
      this.messageService.createToast(`Notifications push refusées`, 'danger');
    }
  }

  listener() {
    PushNotifications.addListener('registration', (token) => {
      this.messageService.createConfirm('Registration', `Registration successfull, token : ${token.value}`, () => {});
    });

    PushNotifications.addListener('registrationError', (e) => {
      this.messageService.createConfirm('Registration Error', JSON.stringify(e), () => {});
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      this.messageService.createConfirm('Notification', 'Notification reçue !', () => {});
    });

    PushNotifications.addListener('pushNotificationActionPerformed', () => {
      this.messageService.createConfirm('Notification', 'Action effectuée', () => {});
    });

  }

}
