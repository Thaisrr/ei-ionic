import { Injectable } from '@angular/core';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {MessageService} from './message.service';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Storage} from '@ionic/storage-angular';
import {Router} from '@angular/router';
import {NativeBiometric} from 'capacitor-native-biometric';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url = 'https://reqres.in/api';
  isLogged$ = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private storage: Storage,
    private router: Router
  ) { }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, user)
      .pipe(
        tap(res => {
          this.storage.set('token', res?.token);
          this.isLogged$.next(true);
          this.setBiometric(user);
          this.messageService.createToast(`Bienvenue !`, 'success');
        }),
        catchError((e) => {
          console.error(e);
          this.messageService.createToast(`Identifiants invalides`, 'danger');
          throw new Error('Identifiants invalides');
        })
      );
  }

  register(user: User): Observable<any> {
    console.error(user);
    return this.http.post(`${this.url}/register`, user)
      .pipe(
        tap(res => {
          console.log(res);
          this.isLogged$.next(true);
          this.setBiometric(user);
          this.messageService.createToast(`Bienvenue !`, 'success');
        }),
        catchError(e => {
          console.error(e);
          this.messageService.createToast(`Quelque chose s'est mal passé`, 'danger');
          throw e;
        })
      );
  }

  async checkToken(): Promise<boolean> {
    const token = await this.storage.get('token');
    this.isLogged$.next(!!token);
    return !!token;
  }

  checkTokenValidity(): Observable<boolean> {
    const token$ = from(this.getToken());
    return token$.pipe(
      switchMap(token => this.http.get<boolean>('url', {
        params: {token}
      })),
      tap(res => {
        this.isLogged$.next(res);
        if(!res) {this.logout();}
      })
    );
  }

  async getToken(): Promise<string> {
    return await this.storage.get('token');
  }

  logout() {
    this.storage.remove('token');
    this.isLogged$.next(false);
    this.messageService.createToast(`Vous avez été déconnecté.e`);
    this.router.navigate(['login']);
  }

  /***** Biometric ***********/

  setBiometric(user: User) {
    return from(
      NativeBiometric.setCredentials({
        username: user.email,
        password: user.password,
        server: 'monserver'
      })
    );
  }

  async checkBiometric() {
    let credential;
    try {
      const {isAvailable} = await NativeBiometric.isAvailable();
      if(isAvailable) {
        credential = await NativeBiometric.getCredentials({
          server: 'monserver'
        });
      }
    } catch (e) {
      throw new Error(`Biometrie indisponible`);
    }
    if(credential) {
      try {
        await NativeBiometric.verifyIdentity({
          reason: 'raison pour IOS',
          title: '(Android) Se connecter',
          subtitle: '(Android) why not ?',
          description: '(Android) une petite description',
          negativeButtonText: 'Nope !' // android
        });
        return credential;
      } catch (e) {
        this.messageService.createToast(`Impossible de se connecter via les empruntes`, 'danger');
      }
    }


  }

  loginBiometric() {
    return from(this.checkBiometric())
      .pipe(
        map(credentials => ({email: credentials.username, password: credentials.password}) ),
        switchMap(credentials => this.login(credentials))
      );
  }

  async isBioAvailable() {
    try {
      const options = await NativeBiometric.isAvailable();
      console.log(options);
      return options.isAvailable;
    } catch (e) {
      return false;
    }
  }

}
