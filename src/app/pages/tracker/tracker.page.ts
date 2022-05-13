import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {MessageService} from '../../utils/services/message.service';
import {AuthenticationService} from '../../utils/services/authentication.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {
  state = 'Pas commencé';
  countdown?: number = null;

  constructor(
    private idle: Idle,
    private changeDetector: ChangeDetectorRef,
    private messageService: MessageService,
    private authService: AuthenticationService
  ) {
    this.initTracker();
    this.detectIdleStart();
    this.detectIdleEnd();
    this.handleTimeout();
    this.warnTimeOut();
  }

  ngOnInit() {}

  initTracker() {
    console.log('init start');
    // Combien de temps avant d'être inactif ( en secondes )
    this.idle.setIdle(5);
    // Temps d'inactivité "autorisée" avant d'agir
    this.idle.setTimeout(5);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.watch();
    console.log('init end');
  }

  detectIdleStart() {
    console.log('detect start');
    this.idle.onIdleStart.subscribe(() => {
      console.warn('Idle !');
      this.state = 'Inactif';
      this.messageService.createToast(`Vous allez être déconnecté`);
    });
  }

  detectIdleEnd() {
    this.idle.onIdleEnd.subscribe(() => {
      // eslint-disable-next-line no-console
      console.info('Activitée detectée');
      this.state = 'Actif';
      this.countdown = null;
      this.changeDetector.detectChanges();
    });
  }

  handleTimeout() {
    this.idle.onTimeout.subscribe(() => {
      this.state = 'TIME OUT !!!!!!';
      this.authService.logout();
    });
  }

  warnTimeOut() {
    this.idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);
  }

  reset() {
    this.state = 'Tout va bien';
    this.countdown = null;
    this.idle.watch();
  }


}
